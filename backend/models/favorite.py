from models import db
from datetime import datetime

class Favorite(db.Model):
    """Favorite model for tracking user's favorited patterns"""
    
    __tablename__ = 'favorites'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pattern_id = db.Column(db.Integer, db.ForeignKey('patterns.id'), nullable=False)
    
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='favorites')
    pattern = db.relationship('Pattern', backref='favorited_by')
    
    # Unique constraint: user can only favorite a pattern once
    __table_args__ = (
        db.UniqueConstraint('user_id', 'pattern_id', name='unique_user_pattern_favorite'),
    )
    
    def to_dict(self):
        """Convert favorite to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'pattern_id': self.pattern_id,
            'pattern': self.pattern.to_dict() if self.pattern else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def __repr__(self):
        """String representation"""
        return f'<Favorite user_id={self.user_id} pattern_id={self.pattern_id}>'