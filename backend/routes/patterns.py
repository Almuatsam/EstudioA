from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.pattern import Pattern, Category, DifficultyLevel
from models.user import User
from models import db
from datetime import datetime
from werkzeug.utils import secure_filename
import os
from services.search_service import search_patterns


patterns_bp = Blueprint('patterns', __name__)

# Helper function to check allowed file types
def allowed_file(filename):
    """Check if file extension is allowed"""
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@patterns_bp.route('', methods=['GET'])
def get_all_patterns():
    """Get all patterns with optional filters"""
    try:
        # Get query parameters for filtering
        category_id = request.args.get('category_id', type=int)
        difficulty_id = request.args.get('difficulty_id', type=int)
        search_term = request.args.get('search', type=str)
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Start with base query - only show approved and active patterns
        query = Pattern.query.filter_by(is_approved=True, is_active=True)
        
        # Apply filters
        if category_id:
            query = query.filter_by(category_id=category_id)
        
        if difficulty_id:
            query = query.filter_by(difficulty_id=difficulty_id)
        
        if search_term:
            search_pattern = f"%{search_term}%"
            query = query.filter(
                db.or_(
                    Pattern.title.ilike(search_pattern),
                    Pattern.description.ilike(search_pattern),
                    Pattern.tags.ilike(search_pattern),
                    Pattern.designer_name.ilike(search_pattern)
                )
            )
        
        # Order by most recent
        query = query.order_by(Pattern.created_at.desc())
        
        # Paginate results
        paginated_patterns = query.paginate(page=page, per_page=per_page, error_out=False)
        
        # Format response
        patterns_list = []
        for pattern in paginated_patterns.items:
            patterns_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': {
                    'id': pattern.category.id,
                    'name': pattern.category.name
                } if pattern.category else None,
                'difficulty': {
                    'id': pattern.difficulty.id,
                    'name': pattern.difficulty.name
                } if pattern.difficulty else None,
                'tags': pattern.get_tags_list(),
                'preview_image': pattern.preview_image,
                'designer_name': pattern.designer_name,
                'download_count': pattern.download_count,
                'view_count': pattern.view_count,
                'created_at': pattern.created_at.isoformat() if pattern.created_at else None
            })
        
        return jsonify({
            'patterns': patterns_list,
            'total': paginated_patterns.total,
            'pages': paginated_patterns.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patterns_bp.route('/<int:pattern_id>', methods=['GET'])
def get_pattern(pattern_id):
    """Get a specific pattern by ID"""
    try:
        pattern = Pattern.query.get(pattern_id)
        
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404
        
        # Increment view count
        pattern.increment_views()
        
        return jsonify({
            'pattern': {
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': {
                    'id': pattern.category.id,
                    'name': pattern.category.name,
                    'description': pattern.category.description
                } if pattern.category else None,
                'difficulty': {
                    'id': pattern.difficulty.id,
                    'name': pattern.difficulty.name,
                    'description': pattern.difficulty.description
                } if pattern.difficulty else None,
                'tags': pattern.get_tags_list(),
                'preview_image': pattern.preview_image,
                'pdf_file': pattern.pdf_file,
                'designer_name': pattern.designer_name,
                'download_count': pattern.download_count,
                'view_count': pattern.view_count,
                'is_approved': pattern.is_approved,
                'created_at': pattern.created_at.isoformat() if pattern.created_at else None,
                'updated_at': pattern.updated_at.isoformat() if pattern.updated_at else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patterns_bp.route('', methods=['POST'])
@jwt_required()
def create_pattern():
    """Create a new pattern (protected route)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'category_id', 'difficulty_id', 'pdf_file']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Verify category exists
        category = Category.query.get(data['category_id'])
        if not category:
            return jsonify({'error': 'Invalid category ID'}), 400
        
        # Verify difficulty exists
        difficulty = DifficultyLevel.query.get(data['difficulty_id'])
        if not difficulty:
            return jsonify({'error': 'Invalid difficulty ID'}), 400
        
        # Create new pattern
        new_pattern = Pattern(
            title=data['title'],
            description=data['description'],
            category_id=data['category_id'],
            difficulty_id=data['difficulty_id'],
            pdf_file=data['pdf_file'],
            preview_image=data.get('preview_image', ''),
            designer_name=data.get('designer_name', user.full_name),
            is_approved=False,  # Requires admin approval
            is_active=True,
            created_at=datetime.utcnow()
        )
        
        # Handle tags
        if 'tags' in data:
            if isinstance(data['tags'], list):
                new_pattern.set_tags_list(data['tags'])
            else:
                new_pattern.tags = data['tags']
        
        # Save to database
        db.session.add(new_pattern)
        db.session.commit()
        
        return jsonify({
            'message': 'Pattern created successfully and pending approval',
            'pattern': {
                'id': new_pattern.id,
                'title': new_pattern.title,
                'description': new_pattern.description,
                'category_id': new_pattern.category_id,
                'difficulty_id': new_pattern.difficulty_id,
                'tags': new_pattern.get_tags_list(),
                'is_approved': new_pattern.is_approved
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@patterns_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all pattern categories"""
    try:
        categories = Category.query.all()
        
        categories_list = []
        for category in categories:
            categories_list.append({
                'id': category.id,
                'name': category.name,
                'description': category.description
            })
        
        return jsonify({
            'categories': categories_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
@patterns_bp.route('/difficulties', methods=['GET'])
def get_difficulties():
    """Get all difficulty levels"""
    try:
        difficulties = DifficultyLevel.query.order_by(DifficultyLevel.order).all()
        
        difficulties_list = []
        for difficulty in difficulties:
            difficulties_list.append({
                'id': difficulty.id,
                'name': difficulty.name,
                'description': difficulty.description,
                'order': difficulty.order
            })
        
        return jsonify({
            'difficulties': difficulties_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@patterns_bp.route('/search', methods=['GET'])
def search():
    """Search patterns using AI (fuzzy + semantic matching)"""
    try:
        # Get search query from URL parameters
        search_query = request.args.get('q', '').strip()
        
        # Validate search query
        if not search_query:
            return jsonify({'error': 'Search query is required'}), 400
        
        if len(search_query) < 2:
            return jsonify({'error': 'Search query must be at least 2 characters'}), 400
        
        # Get optional parameters
        use_fuzzy = request.args.get('fuzzy', 'true').lower() == 'true'
        use_semantic = request.args.get('semantic', 'true').lower() == 'true'
        limit = request.args.get('limit', 20, type=int)
        
        # Perform search
        results = search_patterns(
            search_term=search_query,
            use_fuzzy=use_fuzzy,
            use_semantic=use_semantic,
            limit=limit
        )
        
        # Format results for response
        patterns_list = []
        for result in results:
            pattern = result['pattern']
            patterns_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': {
                    'id': pattern.category.id,
                    'name': pattern.category.name
                } if pattern.category else None,
                'difficulty': {
                    'id': pattern.difficulty.id,
                    'name': pattern.difficulty.name
                } if pattern.difficulty else None,
                'tags': pattern.get_tags_list(),
                'preview_image': pattern.preview_image,
                'designer_name': pattern.designer_name,
                'score': result['score'],
                'match_type': result['match_type']
            })
        
        return jsonify({
            'query': search_query,
            'total_results': len(patterns_list),
            'patterns': patterns_list
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500