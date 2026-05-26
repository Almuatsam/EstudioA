from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from models.user import User
from models import db
from app import bcrypt, limiter
from datetime import datetime
import requests as http_requests
import re
from services.password_service import validate_password

auth_bp = Blueprint('auth', __name__)


def _user_payload(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'full_name': user.full_name,
        'gender': user.gender,
        'role': user.role
    }


@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    try:
        data = request.get_json()

        for field in ['username', 'email', 'password', 'full_name']:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400

        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already exists'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already exists'}), 400

        pw_errors = validate_password(data['password'])
        if pw_errors:
            return jsonify({'error': pw_errors[0], 'validation_errors': pw_errors}), 400

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        new_user = User(
            username=data['username'],
            email=data['email'],
            password_hash=hashed_password,
            full_name=data['full_name'],
            gender=data.get('gender'),
            role='user',
            created_at=datetime.utcnow()
        )

        db.session.add(new_user)
        db.session.commit()

        access_token = create_access_token(identity=str(new_user.id))
        refresh_token = create_refresh_token(identity=str(new_user.id))

        return jsonify({
            'message': 'User registered successfully',
            'user': _user_payload(new_user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/login', methods=['POST'])
@limiter.limit("10 per minute")
def login():
    try:
        data = request.get_json()

        if 'username' not in data or 'password' not in data:
            return jsonify({'error': 'Username and password are required'}), 400

        user = User.query.filter_by(username=data['username']).first()

        if not user or not user.password_hash:
            return jsonify({'error': 'Invalid username or password'}), 401

        if not bcrypt.check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid username or password'}), 401

        user.last_login = datetime.utcnow()
        db.session.commit()

        access_token = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            'message': 'Login successful',
            'user': _user_payload(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/logout', methods=['POST'])
def logout():
    # Token is stateless — client discards it from localStorage
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    try:
        current_user_id = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user_id)
        return jsonify({'access_token': new_access_token}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = get_jwt_identity()
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
    try:
        data = request.get_json()
        code         = data.get('code')
        redirect_uri = data.get('redirect_uri')

        if not code:
            return jsonify({'error': 'code is required'}), 400

        client_id     = current_app.config.get('GOOGLE_CLIENT_ID', '')
        client_secret = current_app.config.get('GOOGLE_CLIENT_SECRET', '')

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

        google_access_token = token_data.get('access_token')
        info_resp = http_requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {google_access_token}'},
            timeout=10
        )
        info = info_resp.json()

        google_id = info.get('id')
        email     = info.get('email', '')
        full_name = info.get('name', '')

        if not google_id or not email:
            return jsonify({'error': 'Incomplete Google profile'}), 400

        user = User.query.filter_by(google_id=google_id).first()
        if not user:
            user = User.query.filter_by(email=email).first()
            if user:
                user.google_id = google_id
                db.session.commit()

        if not user:
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

        user.last_login = datetime.utcnow()
        db.session.commit()

        access_token  = create_access_token(identity=str(user.id))
        refresh_token = create_refresh_token(identity=str(user.id))

        return jsonify({
            'message': 'Google login successful',
            'user': _user_payload(user),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))

        if not user:
            return jsonify({'error': 'User not found'}), 404

        if not user.password_hash:
            return jsonify({'error': 'Password change not available for Google accounts'}), 400

        data = request.get_json()

        if 'current_password' not in data or 'new_password' not in data:
            return jsonify({'error': 'Current password and new password are required'}), 400

        if not bcrypt.check_password_hash(user.password_hash, data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 401

        pw_errors = validate_password(data['new_password'])
        if pw_errors:
            return jsonify({'error': pw_errors[0], 'validation_errors': pw_errors}), 400

        user.password_hash = bcrypt.generate_password_hash(data['new_password']).decode('utf-8')
        db.session.commit()

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
