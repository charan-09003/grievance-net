from datetime import datetime
from flask import Blueprint, current_app, g, jsonify, request


user_bp = Blueprint('user', __name__)


@user_bp.route('/complaints', methods=['GET'])
def get_complaints():
    email = g.user['email']
    mongo = current_app.mongo

    limit = max(1, int(request.args.get('limit', 10)))
    offset = (int(request.args.get('page', 1)) - 1) * limit

    cursor = (
        mongo.db.complaints
        .find({'email': email})
        .sort('created_at', -1)
        .skip(offset)
        .limit(limit)
    )

    complaints = list(cursor)

    for c in complaints:
        c['_id'] = str(c['_id'])
        if "created_at" in c and isinstance(c["created_at"], datetime):
            c["created_at"] = c["created_at"].isoformat()

    return jsonify({
        'status': 'success',
        'data': complaints
    })
