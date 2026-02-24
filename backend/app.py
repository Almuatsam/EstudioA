from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from config import config
from models import db
import os

# Initialize extensions
jwt = JWTManager()
bcrypt = Bcrypt()

def create_app(config_name='development'):
    """Application factory function"""
    
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    CORS(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Initialize database
    db.init_app(app)
    
    # Create upload folder if it doesn't exist
    upload_folder = app.config.get('UPLOAD_FOLDER', 'uploads')
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
    
    # Serve uploaded files
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        """Serve uploaded files with subdirectory support"""
        uploads_dir = os.path.join(os.path.dirname(__file__), 'uploads')
        print(f"Serving file: {filename} from {uploads_dir}")  # Debug log
        return send_from_directory(uploads_dir, filename)
    
    # Import all models and create database tables
    with app.app_context():
        from models.user import User
        from models.pattern import Pattern, Category, DifficultyLevel
        from models.upload import Upload
        from models.history import History
        
        db.create_all()
        print("Database tables created successfully!")
    
    # Register blueprints (routes)
    from routes.auth import auth_bp
    from routes.patterns import patterns_bp
    from routes.admin import admin_bp
    from routes.upload import upload_bp
    from routes.recommendations import recommendations_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(patterns_bp, url_prefix='/api/patterns')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(upload_bp, url_prefix='/api/upload')
    app.register_blueprint(recommendations_bp, url_prefix='/api/recommendations')
    
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