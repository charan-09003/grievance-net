from flask import Flask
from flask_cors import CORS
from flask_pymongo import PyMongo
import spacy
import os

from constants.config import Config
from middlewares.auth_middleware import jwt_middleware
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp
from routes.complaint_routes import complaint_bp
from routes.user_routes import user_bp


app = Flask(__name__)
CORS(app)
jwt_middleware(app)

app.config['MONGO_URI'] = Config.MONGO_URI
mongo = PyMongo(app)
mongo.db.users.create_index('email', unique=True)
mongo.db.complaints.create_index([('email', 1), ('created_at', -1)])
mongo.db.complaints.create_index([('created_at', -1)])

model_path = os.path.join(os.path.dirname(__file__), 'grievance_textcat_model')
model = spacy.load(model_path)

app.mongo = mongo
app.model = model

app.register_blueprint(admin_bp, url_prefix='/api/admin')
app.register_blueprint(auth_bp, url_prefix='/api/user')
app.register_blueprint(complaint_bp, url_prefix='/api')
app.register_blueprint(user_bp, url_prefix='/api/user')

if __name__ == '__main__':
    app.run(debug=True)
