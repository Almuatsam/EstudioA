from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.download_history import DownloadHistory
from models.pattern import Pattern
from models import db
from datetime import datetime, timezone
import os

downloads_bp = Blueprint('downloads', __name__)


@downloads_bp.route('/history', methods=['GET'])
@jwt_required()
def get_download_history():
    """Get current user's download history"""
    try:
        user_id = int(get_jwt_identity())
        
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


@downloads_bp.route('/file/<int:pattern_id>', methods=['GET'])
@jwt_required()
def download_pattern_file(pattern_id):
    """Serve the PDF and record the download in one atomic request"""
    try:
        pattern = db.session.get(Pattern, pattern_id)
        if not pattern:
            return jsonify({'error': 'Pattern not found'}), 404

        if not pattern.pdf_file:
            return jsonify({'error': 'No PDF file available'}), 404

        # Build the absolute path to the PDF on disk
        # pattern.pdf_file is like /uploads/patterns/filename.pdf
        # downloads.py lives in backend/routes/, so go up two levels to reach backend/
        backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        file_path = os.path.join(backend_dir, pattern.pdf_file.lstrip('/').replace('/', os.sep))

        if not os.path.exists(file_path):
            return jsonify({'error': 'PDF file not found on disk'}), 404

        # Record the download
        user_id = int(get_jwt_identity())
        download = DownloadHistory(
            user_id=user_id,
            pattern_id=pattern_id,
            downloaded_at=datetime.now(timezone.utc)
        )
        db.session.add(download)
        pattern.download_count = (pattern.download_count or 0) + 1
        db.session.commit()
        print(f'[download_file] Recorded download: user={user_id} pattern={pattern_id}')

        safe_name = f"{pattern.title}.pdf".replace('/', '-')
        return send_file(
            file_path,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=safe_name
        )

    except Exception as e:
        db.session.rollback()
        print(f'[download_file] ERROR: {e}')
        return jsonify({'error': str(e)}), 500


@downloads_bp.route('/track/<int:pattern_id>', methods=['POST'])
@jwt_required()
def track_download(pattern_id):
    """Track when user downloads a pattern"""
    try:
        raw_user_id = get_jwt_identity()
        user_id = int(raw_user_id)  # JWT identity is always a string
        print(f'[track_download] user_id={user_id}, pattern_id={pattern_id}')

        # Check if pattern exists (use session.get for SQLAlchemy 2.x compat)
        pattern = db.session.get(Pattern, pattern_id)
        if not pattern:
            print(f'[track_download] Pattern {pattern_id} not found')
            return jsonify({'error': 'Pattern not found'}), 404

        # Record download
        download = DownloadHistory(
            user_id=user_id,
            pattern_id=pattern_id,
            downloaded_at=datetime.now(timezone.utc)
        )
        db.session.add(download)

        # Increment pattern download count
        pattern.download_count = (pattern.download_count or 0) + 1

        db.session.commit()
        print(f'[track_download] Committed. download.id={download.id}, pattern.download_count={pattern.download_count}')

        return jsonify({'message': 'Download tracked successfully', 'download_id': download.id}), 201

    except Exception as e:
        db.session.rollback()
        print(f'[track_download] ERROR: {e}')
        import traceback; traceback.print_exc()
        return jsonify({'error': str(e)}), 500