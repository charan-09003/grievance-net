from datetime import datetime, timedelta
from flask import Blueprint, request, jsonify, current_app, g
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

from constants.config import Config
from models.request.auth import AuthRequest
from models.user import UserModel


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    user = UserModel(**data)
    user.password = generate_password_hash(user.password)

    mongo = current_app.mongo
    mongo.db.users.insert_one(user.model_dump())
    user.password = None

    return jsonify({
        'status': 'success',
        'user': user.model_dump(),
    })


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    auth_request = AuthRequest(**data)

    mongo = current_app.mongo
    user = mongo.db.users.find_one({'email': auth_request.email})

    if not user or not check_password_hash(user['password'], auth_request.password):
        return jsonify({
            'status': 'error',
            'message': 'User not found or Invalid password'
        }), 401

    user['_id'] = str(user['_id'])
    payload = {
        'user_id': user['_id'],
        'name': user.get('name', ''),
        'email': user.get('email', ''),
        'role': user.get('role', 'user'),
        'exp': (datetime.now() + timedelta(hours=Config.JWT_EXPIRY_HOURS)).timestamp()
    }
    token = jwt.encode(
        payload,
        Config.JWT_SECRET,
        algorithm='HS256'
    )

    return jsonify({
        'status': 'success',
        'token': token,
        'user': {
            '_id': user['_id'],
            'name': user.get('name', ''),
            'email': user.get('email', ''),
            'role': user.get('role', 'user'),
        }
    })


@auth_bp.route('/check-login', methods=['GET'])
def check_login():
    return jsonify({
        'valid': bool(g.user['user_id'])
    })
