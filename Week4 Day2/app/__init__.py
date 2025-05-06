from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from config import Config

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True) 
    app.config.from_object(Config)
    mongo.init_app(app)

    # Import and register blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.idea_routes import idea_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(idea_bp, url_prefix='/api')

    return app
