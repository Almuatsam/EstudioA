from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from services.recommendation_service import (
    get_pattern_recommendations,
    get_user_recommendations,
    get_popular_patterns
)

recommendations_bp = Blueprint('recommendations', __name__)


@recommendations_bp.route('/pattern/<int:pattern_id>', methods=['GET'])
def get_recommendations_for_pattern(pattern_id):
    
    try:
        limit = request.args.get('limit', 10, type=int)
        
        recommendations = get_pattern_recommendations(pattern_id, limit=limit)
        
        # Format response
        recs_list = []
        for rec in recommendations:
            pattern = rec['pattern']
            recs_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': pattern.category.to_dict() if pattern.category else None,
                'difficulty': pattern.difficulty.to_dict() if pattern.difficulty else None,
                'preview_image': pattern.preview_image,
                'designer_name': pattern.designer_name,
                'tags': pattern.get_tags_list(),
                'similarity_score': rec['score'],
                'recommendation_type': rec['recommendation_type']
            })
        
        return jsonify({
            'pattern_id': pattern_id,
            'total_recommendations': len(recs_list),
            'recommendations': recs_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@recommendations_bp.route('/for-me', methods=['GET'])
@jwt_required()
def get_my_recommendations():
    """
    Get personalized recommendations for the current user
    
    Query parameters:
        limit: Maximum number of recommendations (default: 10)
    """
    try:
        current_user_id = get_jwt_identity()
        limit = request.args.get('limit', 10, type=int)
        
        recommendations = get_user_recommendations(int(current_user_id), limit=limit)
        
        # Format response
        recs_list = []
        for rec in recommendations:
            pattern = rec['pattern']
            recs_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': pattern.category.to_dict() if pattern.category else None,
                'difficulty': pattern.difficulty.to_dict() if pattern.difficulty else None,
                'preview_image': pattern.preview_image,
                'designer_name': pattern.designer_name,
                'tags': pattern.get_tags_list(),
                'similarity_score': rec['score'],
                'recommendation_type': rec['recommendation_type'],
                'based_on': rec.get('based_on', 1)
            })
        
        return jsonify({
            'user_id': current_user_id,
            'total_recommendations': len(recs_list),
            'recommendations': recs_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@recommendations_bp.route('/popular', methods=['GET'])
def get_popular():
    """
    Get popular patterns based on downloads and views
    
    Query parameters:
        limit: Maximum number of patterns (default: 10)
    """
    try:
        limit = request.args.get('limit', 10, type=int)
        
        popular = get_popular_patterns(limit=limit)
        
        # Format response
        popular_list = []
        for rec in popular:
            pattern = rec['pattern']
            popular_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': pattern.category.to_dict() if pattern.category else None,
                'difficulty': pattern.difficulty.to_dict() if pattern.difficulty else None,
                'preview_image': pattern.preview_image,
                'designer_name': pattern.designer_name,
                'tags': pattern.get_tags_list(),
                'download_count': pattern.download_count,
                'view_count': pattern.view_count,
                'popularity_score': rec['score'],
                'recommendation_type': rec['recommendation_type']
            })
        
        return jsonify({
            'total_patterns': len(popular_list),
            'popular_patterns': popular_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500