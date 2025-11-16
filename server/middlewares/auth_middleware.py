import jwt
from flask import request, jsonify, g
from constants.config import Config


EXEMPT_ROUTES = [
    "/api/user/login",
    "/api/user/register"
]


def jwt_middleware(app):
    @app.before_request
    def verify_token():
        if request.method == "OPTIONS":
            return None
        if request.path in EXEMPT_ROUTES:
            return None

        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({
                "status": "error",
                "message": "Missing or invalid Authorization header"
            }), 401

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                Config.JWT_SECRET,
                algorithms=["HS256"]
            )

            g.user = payload

        except jwt.ExpiredSignatureError:
            return jsonify({
                "status": "error",
                "message": "Token expired"
            }), 401

        except jwt.InvalidTokenError:
            return jsonify({
                "status": "error",
                "message": "Invalid token"
            }), 401
