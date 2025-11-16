from datetime import datetime
from bson import ObjectId
from flask import Blueprint, current_app, g, jsonify, request
from pydantic import ValidationError

from models.request.set_status import StatusModel


admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/complaints', methods=['GET'])
def get_complaints():
    if g.user.get("role") != "admin":
        return jsonify({
            "status": "error",
            "message": "Access denied. Admin only."
        }), 403

    mongo = current_app.mongo

    limit = max(1, int(request.args.get('limit', 10)))
    offset = (int(request.args.get('page', 1)) - 1) * limit

    cursor = (
        mongo.db.complaints
        .find()
        .sort('created_at', -1)
        .skip(offset)
        .limit(limit)
    )

    complaints = list(cursor)

    for c in complaints:
        c['_id'] = str(c['_id'])
        if 'created_at' in c and isinstance(c['created_at'], datetime):
            c['created_at'] = c['created_at'].isoformat()

    return jsonify({
        'status': 'success',
        'data': complaints
    })


@admin_bp.route('/complaints/<complaint_id>', methods=['PATCH'])
def set_status(complaint_id):
    if g.user.get("role") != "admin":
        return jsonify({
            "status": "error",
            "message": "Access denied. Admin only."
        }), 403

    mongo = current_app.mongo
    data = request.get_json()

    try:
        status_req = StatusModel(**data)
    except ValidationError as e:
        return jsonify({
            'status': 'error',
            'message': e.errors()
        }), 400

    result = mongo.db.complaints.find_one_and_update(
        {
            '_id': ObjectId(complaint_id)
        },
        {
            '$set': {
                'status': status_req.status
            }
        },
        return_document=True
    )

    if not result:
        return jsonify({
            'status': 'error',
            'message': 'Complaint not found'
        }), 404

    result['_id'] = str(result['_id'])

    return jsonify({
        'status': 'success',
        'data': result
    })
