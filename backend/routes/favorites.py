from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.favorite import Favorite
from models.pattern import Pattern
from models import db
from datetime import datetime

favorites_bp = Blueprint('favorites', __name__)


@favorites_bp.route('', methods=['GET'])
@jwt_required()
def get_favorites():
    """Get current user's favorited patterns"""
    try:
        user_id = get_jwt_identity()
        
        # Get all favorites for this user
        favorites = Favorite.query.filter_by(user_id=user_id).order_by(Favorite.created_at.desc()).all()
        
        # Format response with pattern details
        favorites_list = []
        for fav in favorites:
            if fav.pattern:  # Check pattern exists
                pattern_data = {
                    'id': fav.pattern.id,
                    'title': fav.pattern.title,
                    'description': fav.pattern.description,
                    'category': {
                        'id': fav.pattern.category.id,
                        'name': fav.pattern.category.name
                    } if fav.pattern.category else None,
                    'difficulty': {
                        'id': fav.pattern.difficulty.id,
                        'name': fav.pattern.difficulty.name
                    } if fav.pattern.difficulty else None,
                    'preview_image': fav.pattern.preview_image,
                    'designer_name': fav.pattern.designer_name,
                    'download_count': fav.pattern.download_count,
                    'view_count': fav.pattern.view_count,
                    'favorited_at': fav.created_at.isoformat() if fav.created_at else None
                }
                favorites_list.append(pattern_data)
        
        return jsonify({
            'favorites': favorites_list,
            'total': len(favorites_list)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@favorites_bp.route('/<int:pattern_id>', methods=['POST'])
@jwt_required()
def add_favorite(pattern_id):
    """Add pattern to user's favorites"""
    try:
        user_id = get_jwt_identity()
        
        # Check if pattern exists
        pattern = Pattern.query.get(pattern_id)
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404
        
        # Check if already favorited
        existing = Favorite.query.filter_by(user_id=user_id, pattern_id=pattern_id).first()
        if existing:
            return jsonify({'message': 'Pattern already in favorites'}), 200
        
        # Create new favorite
        favorite = Favorite(
            user_id=user_id,
            pattern_id=pattern_id,
            created_at=datetime.utcnow()
        )
        
        db.session.add(favorite)
        db.session.commit()
        
        return jsonify({
            'message': 'Pattern added to favorites',
            'favorite': favorite.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@favorites_bp.route('/<int:pattern_id>', methods=['DELETE'])
@jwt_required()
def remove_favorite(pattern_id):
    """Remove pattern from user's favorites"""
    try:
        user_id = get_jwt_identity()
        
        # Find the favorite
        favorite = Favorite.query.filter_by(user_id=user_id, pattern_id=pattern_id).first()
        
        if not favorite:
            return jsonify({'error': 'Favorite not found'}), 404
        
        db.session.delete(favorite)
        db.session.commit()
        
        return jsonify({'message': 'Pattern removed from favorites'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@favorites_bp.route('/check/<int:pattern_id>', methods=['GET'])
@jwt_required()
def check_favorite(pattern_id):
    """Check if pattern is in user's favorites"""
    try:
        user_id = get_jwt_identity()
        
        favorite = Favorite.query.filter_by(user_id=user_id, pattern_id=pattern_id).first()
        
        return jsonify({
            'is_favorited': favorite is not None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500