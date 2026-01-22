from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import config
from models import db
import os

def create_app(config_name='development'):
    """Application factory function"""
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    jwt = JWTManager(app)
    
    # Initialize database
    db.init_app(app)
    
    # Create upload folder if it doesn't exist
    upload_folder = app.config['UPLOAD_FOLDER']
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Import all models and create database tables
    with app.app_context():
        from models.user import User
        from models.pattern import Pattern, Category, DifficultyLevel
        from models.upload import Upload
        from models.history import History
        
        db.create_all()
        print("Database tables created successfully!")
    
    # Register blueprints (routes) - will add later
    # from routes import auth_bp, patterns_bp, admin_bp
    # app.register_blueprint(auth_bp)
    # app.register_blueprint(patterns_bp)
    # app.register_blueprint(admin_bp)
    
    # Health check route
    @app.route('/')
    def index():
        return {
            'message': 'EstudioA API is running',
            'status': 'healthy',
            'version': '1.0.0'
        }
    
    @app.route('/health')
    def health():
        return {'status': 'healthy'}, 200
    
    return app


if __name__ == '__main__':
    # Create the app
    app = create_app('development')
    
    # Run the app
    print("=" * 50)
    print("EstudioA Backend Server Starting...")
    print("=" * 50)
    print(f"Environment: development")
    print(f"Debug Mode: {app.config['DEBUG']}")
    print(f"Server running on: http://127.0.0.1:5000")
    print("=" * 50)
    
    app.run(host='0.0.0.0', port=5000, debug=True)