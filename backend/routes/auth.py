from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models.user import User
from models import db
from app import bcrypt
from datetime import datetime
import requests as http_requests
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'full_name']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Check if username already exists
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        # Create new user
        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=hashed_password,
            full_name=data['full_name'],
            gender=data.get('gender'),  # NEW: Accept gender from registration
            role=data.get('role', 'user'),  # Default to 'user', can be 'user', 'designer', 'admin'
            created_at=datetime.utcnow()
        )
        
        # Save to database
        db.session.add(new_user)
        db.session.commit()
        
        # Create access token (convert ID to string for JWT)
        access_token = create_access_token(identity=str(new_user.id))
        refresh_token = create_refresh_token(identity=str(new_user.id))
        
        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'username': new_user.username,
                'email': new_user.email,
                'full_name': new_user.full_name,
                'gender': new_user.gender,
                'role': new_user.role
            },
            'token': access_token,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    try:
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password are required'}), 400
        
        # Find user
        user = User.query.filter_by(username=data['username']).first()
        
        if not user:
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Check password
        if not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Create tokens (convert ID to string for JWT)
        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'gender': user.gender,
                'role': user.role
            },
            'token': access_token,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Refresh access token"""
    try:
        current_user_id = get_jwt_identity()
        # Identity is already a string from JWT, keep it as string
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': new_access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        current_user_id = get_jwt_identity()
        # Convert string ID back to integer for database query
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        return jsonify({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'gender': user.gender,
                'role': user.role,
                'is_active': user.is_active,
                'is_verified': user.is_verified,
                'created_at': user.created_at.isoformat() if user.created_at else None,
                'last_login': user.last_login.isoformat() if user.last_login else None
            }
        }), 200
    
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/google', methods=['POST'])
def google_login():
    """
    Exchange a Google OAuth authorization code for user info and return a JWT.
    Accepts: { code, redirect_uri }
    """
    try:
        data = request.get_json()
        code         = data.get('code')
        redirect_uri = data.get('redirect_uri')

        if not code:
            return jsonify({'error': 'code is required'}), 400

        client_id     = current_app.config.get('GOOGLE_CLIENT_ID', '')
        client_secret = current_app.config.get('GOOGLE_CLIENT_SECRET', '')

        # Exchange code for tokens
        token_resp = http_requests.post(
            'https://oauth2.googleapis.com/token',
            data={
                'code': code,
                'client_id': client_id,
                'client_secret': client_secret,
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code',
            },
            timeout=10
        )
        token_data = token_resp.json()
        if 'error' in token_data:
            return jsonify({'error': token_data.get('error_description', 'Token exchange failed')}), 401

        # Get user info using the access token
        access_token = token_data.get('access_token')
        info_resp = http_requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=10
        )
        info = info_resp.json()

        google_id = info.get('id')
        email     = info.get('email', '')
        full_name = info.get('name', '')

        if not google_id or not email:
            return jsonify({'error': 'Incomplete Google profile'}), 400

        # Find existing user by google_id or email
        user = User.query.filter_by(google_id=google_id).first()
        if not user:
            user = User.query.filter_by(email=email).first()
            if user:
                # Link Google ID to existing account
                user.google_id = google_id
                db.session.commit()

        if not user:
            # Create new account
            base_username = re.sub(r'[^a-z0-9]', '', email.split('@')[0].lower()) or 'user'
            username = base_username
            suffix = 1
            while User.query.filter_by(username=username).first():
                username = f"{base_username}{suffix}"
                suffix += 1

            user = User(
                username=username,
                email=email,
                full_name=full_name,
                google_id=google_id,
                password_hash=None,
                role='user',
                is_active=True,
                is_verified=True,
                created_at=datetime.utcnow()
            )
            db.session.add(user)
            db.session.commit()

        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()

        access_token  = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            'message': 'Google login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.full_name,
                'gender': user.gender,
                'role': user.role
            },
            'token': access_token,
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user's password"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        if 'current_password' not in data or 'new_password' not in data:
            return jsonify({'error': 'Current password and new password are required'}), 400
        
        # Check current password
        if not bcrypt.check_password_hash(user.password_hash, data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401
        
        # Validate new password
        if len(data['new_password']) < 8:
            return jsonify({'error': 'New password must be at least 8 characters'}), 400
        
        # Set new password
        hashed_password = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        user.password_hash = hashed_password
        db.session.commit()
        
        return jsonify({'message': 'Password changed successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500