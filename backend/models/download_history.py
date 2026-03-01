from models import db
from datetime import datetime

class DownloadHistory(db.Model):
    """Download history model for tracking pattern downloads"""
    
    __tablename__ = 'download_history'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pattern_id = db.Column(db.Integer, db.ForeignKey('patterns.id'), nullable=False)
    
    # Timestamp
    downloaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='download_history')
    pattern = db.relationship('Pattern', backref='downloads')
    
    def to_dict(self):
        """Convert download history to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pattern_id': self.pattern_id,
            'pattern': self.pattern.to_dict() if self.pattern else None,
            'downloaded_at': self.downloaded_at.isoformat() if self.downloaded_at else None
        }
    
    def __repr__(self):
        """String representation"""
        return f'<DownloadHistory user_id={self.user_id} pattern_id={self.pattern_id}>'