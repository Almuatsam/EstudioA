from . import db
from datetime import datetime

class History(db.Model):
    """History model for tracking user pattern views"""
    
    __tablename__ = 'history'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pattern_id = db.Column(db.Integer, db.ForeignKey('patterns.id'), nullable=False)
    
    # Interaction details
    action = db.Column(db.String(20), default='view', nullable=False)
    # Action types: 'view', 'download', 'favorite'
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Composite index for faster queries
    __table_args__ = (
        db.Index('idx_user_pattern', 'user_id', 'pattern_id'),
        db.Index('idx_user_created', 'user_id', 'created_at'),
    )
    
    @staticmethod
    def record_view(user_id, pattern_id):
        """Record a pattern view"""
        history_entry = History(
            user_id=user_id,
            pattern_id=pattern_id,
            action='view'
        )
        db.session.add(history_entry)
        db.session.commit()
        return history_entry
    
    @staticmethod
    def record_download(user_id, pattern_id):
        """Record a pattern download"""
        history_entry = History(
            user_id=user_id,
            pattern_id=pattern_id,
            action='download'
        )
        db.session.add(history_entry)
        db.session.commit()
        return history_entry
    
    @staticmethod
    def get_user_history(user_id, limit=20):
        """Get recent history for a user"""
        return History.query.filter_by(user_id=user_id).order_by(
            History.created_at.desc()
        ).limit(limit).all()
    
    @staticmethod
    def get_user_viewed_patterns(user_id, limit=20):
        """Get patterns a user has viewed"""
        from .pattern import Pattern
        
        history_entries = History.query.filter_by(
            user_id=user_id,
            action='view'
        ).order_by(History.created_at.desc()).limit(limit).all()
        
        pattern_ids = [h.pattern_id for h in history_entries]
        patterns = Pattern.query.filter(Pattern.id.in_(pattern_ids)).all()
        
        return patterns
    
    def to_dict(self, include_pattern=True):
        """Convert history entry to dictionary"""
        data = {
            'id': self.id,
            'action': self.action,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_pattern and self.pattern:
            data['pattern'] = self.pattern.to_dict()
        
        return data
    
    def __repr__(self):
        return f'<History User:{self.user_id} Pattern:{self.pattern_id} {self.action}>'