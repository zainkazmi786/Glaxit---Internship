from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS

# Create a global PyMongo instance
mongo = PyMongo()

def create_app(config_name='default'):
    from config import config
    
    # Initialize Flask application
    app = Flask(__name__)
    CORS(app)  # Enable CORS for all routes
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    mongo.init_app(app)
    
    # Import blueprints here to avoid circular imports
    from .products.routes import products_bp
    from .categories.routes import categories_bp
    from .orders.routes import orders_bp
    # from .contact.routes import contact_bp
    from .payments.routes import payments_bp
    
    # Register blueprints
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    # app.register_blueprint(contact_bp, url_prefix='/api/contact')
    app.register_blueprint(payments_bp, url_prefix='/api/payments')
    
    # Create upload folder if it doesn't exist
    import os
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    
    @app.route('/')
    def index():
        return {'message': 'E-commerce API is running'}
    
    return app