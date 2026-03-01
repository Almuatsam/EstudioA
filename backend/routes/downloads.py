from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.download_history import DownloadHistory
from models.pattern import Pattern
from models import db
from datetime import datetime

downloads_bp = Blueprint('downloads', __name__)


@downloads_bp.route('/history', methods=['GET'])
@jwt_required()
def get_download_history():
    """Get current user's download history"""
    try:
        user_id = get_jwt_identity()
        
        # Get pagination parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        # Query download history
        paginated = DownloadHistory.query.filter_by(user_id=user_id)\
            .order_by(DownloadHistory.downloaded_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)
        
        # Format response
        downloads_list = []
        for download in paginated.items:
            if download.pattern:  # Check pattern exists
                pattern_data = {
                    'id': download.pattern.id,
                    'title': download.pattern.title,
                    'description': download.pattern.description,
                    'category': {
                        'id': download.pattern.category.id,
                        'name': download.pattern.category.name
                    } if download.pattern.category else None,
                    'difficulty': {
                        'id': download.pattern.difficulty.id,
                        'name': download.pattern.difficulty.name
                    } if download.pattern.difficulty else None,
                    'preview_image': download.pattern.preview_image,
                    'pdf_file': download.pattern.pdf_file,
                    'designer_name': download.pattern.designer_name,
                    'downloaded_at': download.downloaded_at.isoformat() if download.downloaded_at else None
                }
                downloads_list.append(pattern_data)
        
        return jsonify({
            'downloads': downloads_list,
            'total': paginated.total,
            'page': page,
            'per_page': per_page,
            'pages': paginated.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@downloads_bp.route('/track/<int:pattern_id>', methods=['POST'])
@jwt_required()
def track_download(pattern_id):
    """Track when user downloads a pattern"""
    try:
        user_id = get_jwt_identity()
        
        # Check if pattern exists
        pattern = Pattern.query.get(pattern_id)
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404
        
        # Create download history record
        download = DownloadHistory(
            user_id=user_id,
            pattern_id=pattern_id,
            downloaded_at=datetime.utcnow()
        )
        
        # Increment pattern download count
        pattern.download_count = (pattern.download_count or 0) + 1
        
        db.session.add(download)
        db.session.commit()
        
        return jsonify({
            'message': 'Download tracked successfully',
            'download': download.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500