from flask import Blueprint, request, jsonify, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
from models.user import User
from models import db
import os
from datetime import datetime
from PIL import Image
import uuid

upload_bp = Blueprint('upload', __name__)

# Get upload folder from config
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def generate_unique_filename(original_filename):
    """Generate unique filename to prevent collisions"""
    ext = original_filename.rsplit('.', 1)[1].lower()
    unique_name = f"{uuid.uuid4().hex}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{ext}"
    return unique_name

def create_thumbnail(image_path, thumbnail_path, size=(300, 300)):
    """Create a thumbnail for an image"""
    try:
        with Image.open(image_path) as img:
            # Convert RGBA to RGB 
            if img.mode == 'RGBA':
                img = img.convert('RGB')
            
            # Create thumbnail maintaining aspect ratio
            img.thumbnail(size, Image.Resampling.LANCZOS)
            img.save(thumbnail_path, 'JPEG', quality=85)
            return True
    except Exception as e:
        print(f"Error creating thumbnail: {e}")
        return False


@upload_bp.route('/pattern-file', methods=['POST'])
@jwt_required()
def upload_pattern_file():
    """Upload a PDF pattern file (protected route)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Check if it's a PDF
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are allowed for pattern files'}), 400
        
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        
        # Create patterns subfolder if it doesn't exist
        patterns_folder = os.path.join(UPLOAD_FOLDER, 'patterns')
        os.makedirs(patterns_folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(patterns_folder, filename)
        file.save(file_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        return jsonify({
            'message': 'Pattern file uploaded successfully',
            'file': {
                'filename': filename,
                'original_filename': secure_filename(file.filename),
                'file_path': f'/uploads/patterns/{filename}',
                'file_size': file_size,
                'file_type': 'pdf'
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/pattern-image', methods=['POST'])
@jwt_required()
def upload_pattern_image():
    """Upload a pattern preview image (protected route)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Check if it's an image
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            return jsonify({'error': 'Only image files are allowed (PNG, JPG, JPEG, GIF)'}), 400
        
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        
        # Create images subfolder if it doesn't exist
        images_folder = os.path.join(UPLOAD_FOLDER, 'images')
        thumbnails_folder = os.path.join(UPLOAD_FOLDER, 'thumbnails')
        os.makedirs(images_folder, exist_ok=True)
        os.makedirs(thumbnails_folder, exist_ok=True)
        
        # Save original image
        file_path = os.path.join(images_folder, filename)
        file.save(file_path)
        
        # Create thumbnail
        thumbnail_filename = f"thumb_{filename}"
        thumbnail_path = os.path.join(thumbnails_folder, thumbnail_filename)
        create_thumbnail(file_path, thumbnail_path)
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        return jsonify({
            'message': 'Pattern image uploaded successfully',
            'file': {
                'filename': filename,
                'original_filename': secure_filename(file.filename),
                'file_path': f'/uploads/images/{filename}',
                'thumbnail_path': f'/uploads/thumbnails/{thumbnail_filename}',
                'file_size': file_size,
                'file_type': 'image'
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/file', methods=['POST'])
@jwt_required()
def upload_file():
    """Generic file upload endpoint (protected route)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Check if file is in request
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Validate file type
        if not allowed_file(file.filename):
            return jsonify({'error': f'File type not allowed. Allowed types: {", ".join(ALLOWED_EXTENSIONS)}'}), 400
        
        # Generate unique filename
        filename = generate_unique_filename(file.filename)
        
        # Determine file type and folder
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        if file_ext == 'pdf':
            folder = os.path.join(UPLOAD_FOLDER, 'patterns')
            url_path = '/uploads/patterns'
        else:
            folder = os.path.join(UPLOAD_FOLDER, 'images')
            url_path = '/uploads/images'
        
        os.makedirs(folder, exist_ok=True)
        
        # Save file
        file_path = os.path.join(folder, filename)
        file.save(file_path)
        
        # Create thumbnail for images
        thumbnail_path = None
        if file_ext in ['png', 'jpg', 'jpeg', 'gif']:
            thumbnails_folder = os.path.join(UPLOAD_FOLDER, 'thumbnails')
            os.makedirs(thumbnails_folder, exist_ok=True)
            thumbnail_filename = f"thumb_{filename}"
            thumbnail_full_path = os.path.join(thumbnails_folder, thumbnail_filename)
            if create_thumbnail(file_path, thumbnail_full_path):
                thumbnail_path = f'/uploads/thumbnails/{thumbnail_filename}'
        
        # Get file size
        file_size = os.path.getsize(file_path)
        
        response = {
            'message': 'File uploaded successfully',
            'file': {
                'filename': filename,
                'original_filename': secure_filename(file.filename),
                'file_path': f'{url_path}/{filename}',
                'file_size': file_size,
                'file_type': file_ext
            }
        }
        
        if thumbnail_path:
            response['file']['thumbnail_path'] = thumbnail_path
        
        return jsonify(response), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@upload_bp.route('/<path:filename>', methods=['GET'])
def serve_file(filename):
    """Serve uploaded files"""
    try:
        # Determine which subfolder to look in based on path
        if filename.startswith('patterns/'):
            folder = os.path.join(UPLOAD_FOLDER, 'patterns')
            file = filename.replace('patterns/', '')
        elif filename.startswith('images/'):
            folder = os.path.join(UPLOAD_FOLDER, 'images')
            file = filename.replace('images/', '')
        elif filename.startswith('thumbnails/'):
            folder = os.path.join(UPLOAD_FOLDER, 'thumbnails')
            file = filename.replace('thumbnails/', '')
        else:
            folder = UPLOAD_FOLDER
            file = filename
        
        return send_from_directory(folder, file)
        
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500