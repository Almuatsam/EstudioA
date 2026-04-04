from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.pattern import Pattern, Category, DifficultyLevel
from models.user import User
from models.favorite import Favorite
from models import db
from datetime import datetime
from services.email_service import notify_designer_approved, notify_designer_rejected, notify_users_new_pattern

admin_bp = Blueprint('admin', __name__)


def admin_required():
    """Decorator to check if user is admin"""
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return None, {'error': 'User not found'}, 404
    
    if user.role != 'admin':
        return None, {'error': 'Admin access required'}, 403
    
    return user, None, None


@admin_bp.route('/patterns/pending', methods=['GET'])
@jwt_required()
def get_pending_patterns():
    """Get all patterns pending approval (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        # Query for pending patterns
        query = Pattern.query.filter_by(is_approved=False, is_active=True)
        query = query.order_by(Pattern.created_at.desc())
        
        paginated_patterns = query.paginate(page=page, per_page=per_page, error_out=False)
        
        patterns_list = []
        for pattern in paginated_patterns.items:
            patterns_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': pattern.category.to_dict() if pattern.category else None,
                'difficulty': pattern.difficulty.to_dict() if pattern.difficulty else None,
                'designer_name': pattern.designer_name,
                'pdf_file': pattern.pdf_file,
                'preview_image': pattern.preview_image,
                'tags': pattern.get_tags_list(),
                'created_at': pattern.created_at.isoformat() if pattern.created_at else None
            })
        
        return jsonify({
            'patterns': patterns_list,
            'total': paginated_patterns.total,
            'pages': paginated_patterns.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/patterns/<int:pattern_id>/approve', methods=['POST'])
@jwt_required()
def approve_pattern(pattern_id):
    """Approve a pattern (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        pattern = Pattern.query.get(pattern_id)
        
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404
        
        if pattern.is_approved:
            return jsonify({'error': 'Pattern is already approved'}), 400
        
        # Approve the pattern
        pattern.is_approved = True
        pattern.approved_at = datetime.utcnow()
        db.session.commit()

        # Email: notify designer
        designer = User.query.get(pattern.user_id) if pattern.user_id else None
        if designer and designer.email:
            notify_designer_approved(designer.email, designer.full_name or designer.username, pattern.title)

        # Email: notify all regular users about the new published pattern
        user_emails = [
            u.email for u in User.query.filter_by(role='user', is_active=True).all()
            if u.email
        ]
        notify_users_new_pattern(user_emails, pattern.title, pattern.designer_name or '', pattern.id)

        return jsonify({
            'message': 'Pattern approved successfully',
            'pattern': {
                'id': pattern.id,
                'title': pattern.title,
                'is_approved': pattern.is_approved,
                'approved_at': pattern.approved_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/patterns/<int:pattern_id>/reject', methods=['POST'])
@jwt_required()
def reject_pattern(pattern_id):
    """Reject/deactivate a pattern (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        pattern = Pattern.query.get(pattern_id)
        
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404
        
        # Deactivate the pattern
        pattern.is_active = False
        db.session.commit()

        # Email: notify designer
        designer = User.query.get(pattern.user_id) if pattern.user_id else None
        if designer and designer.email:
            notify_designer_rejected(designer.email, designer.full_name or designer.username, pattern.title)

        return jsonify({
            'message': 'Pattern rejected successfully',
            'pattern': {
                'id': pattern.id,
                'title': pattern.title,
                'is_active': pattern.is_active
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/patterns', methods=['GET'])
@jwt_required()
def get_all_patterns_admin():
    """Get all patterns including pending (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status_filter = request.args.get('status', 'all')  # all, approved, pending, rejected
        
        # Build query
        query = Pattern.query
        
        if status_filter == 'approved':
            query = query.filter_by(is_approved=True, is_active=True)
        elif status_filter == 'pending':
            query = query.filter_by(is_approved=False, is_active=True)
        elif status_filter == 'rejected':
            query = query.filter_by(is_active=False)
        
        query = query.order_by(Pattern.created_at.desc())
        paginated_patterns = query.paginate(page=page, per_page=per_page, error_out=False)
        
        patterns_list = []
        for pattern in paginated_patterns.items:
            patterns_list.append({
                'id': pattern.id,
                'title': pattern.title,
                'description': pattern.description,
                'category': pattern.category.to_dict() if pattern.category else None,
                'difficulty': pattern.difficulty.to_dict() if pattern.difficulty else None,
                'designer_name': pattern.designer_name,
                'is_approved': pattern.is_approved,
                'is_active': pattern.is_active,
                'download_count': pattern.download_count,
                'view_count': pattern.view_count,
                'created_at': pattern.created_at.isoformat() if pattern.created_at else None,
                'approved_at': pattern.approved_at.isoformat() if pattern.approved_at else None
            })
        
        return jsonify({
            'patterns': patterns_list,
            'total': paginated_patterns.total,
            'pages': paginated_patterns.pages,
            'current_page': page,
            'status_filter': status_filter
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        query = User.query.order_by(User.created_at.desc())
        paginated_users = query.paginate(page=page, per_page=per_page, error_out=False)
        
        users_list = []
        for u in paginated_users.items:
            users_list.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'full_name': u.full_name,
                'role': u.role,
                'is_active': u.is_active,
                'is_verified': u.is_verified,
                'created_at': u.created_at.isoformat() if u.created_at else None,
                'last_login': u.last_login.isoformat() if u.last_login else None
            })
        
        return jsonify({
            'users': users_list,
            'total': paginated_users.total,
            'pages': paginated_users.pages,
            'current_page': page
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    """Update user role (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        target_user = User.query.get(user_id)
        
        if not target_user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        if 'role' not in data:
            return jsonify({'error': 'Role is required'}), 400
        
        # Validate role
        valid_roles = ['user', 'designer', 'admin']
        if data['role'] not in valid_roles:
            return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
        
        # Update role
        target_user.role = data['role']
        db.session.commit()
        
        return jsonify({
            'message': 'User role updated successfully',
            'user': {
                'id': target_user.id,
                'username': target_user.username,
                'role': target_user.role
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Soft-delete a user (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code

    try:
        target_user = User.query.get(user_id)
        if not target_user:
            return jsonify({'error': 'User not found'}), 404

        if target_user.role == 'admin':
            return jsonify({'error': 'Cannot delete admin accounts'}), 403

        target_user.is_active = False
        db.session.commit()

        return jsonify({'message': 'User deleted successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_stats():
    """Get platform statistics (admin only)"""
    user, error_response, status_code = admin_required()
    if error_response:
        return jsonify(error_response), status_code
    
    try:
        # Count statistics
        total_users = User.query.count()
        total_patterns = Pattern.query.count()
        approved_patterns = Pattern.query.filter_by(is_approved=True).count()
        pending_patterns = Pattern.query.filter_by(is_approved=False, is_active=True).count()
        
        # Total downloads, views, and favorites
        total_downloads = db.session.query(db.func.sum(Pattern.download_count)).scalar() or 0
        total_views = db.session.query(db.func.sum(Pattern.view_count)).scalar() or 0
        total_favorites = Favorite.query.count()

        return jsonify({
            'stats': {
                'total_users': total_users,
                'total_patterns': total_patterns,
                'approved_patterns': approved_patterns,
                'pending_patterns': pending_patterns,
                'total_downloads': total_downloads,
                'total_views': total_views,
                'total_favorites': total_favorites
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500