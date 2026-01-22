from . import db
from datetime import datetime

class Upload(db.Model):
    """Upload model for tracking pattern submissions"""
    
    __tablename__ = 'uploads'
    
    # Primary key
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Foreign keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    pattern_id = db.Column(db.Integer, db.ForeignKey('patterns.id'), nullable=False)
    
    # Upload status
    status = db.Column(db.String(20), default='pending', nullable=False)
    # Status values: 'pending', 'approved', 'rejected'
    
    # Review information
    reviewed_by = db.Column(db.Integer, db.ForeignKey('users.id'))  # Admin who reviewed
    review_notes = db.Column(db.Text)  # Admin's notes/reason
    reviewed_at = db.Column(db.DateTime)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    reviewer = db.relationship('User', foreign_keys=[reviewed_by], backref='reviewed_uploads')
    
    def approve(self, admin_id, notes=None):
        """Approve the upload"""
        self.status = 'approved'
        self.reviewed_by = admin_id
        self.review_notes = notes
        self.reviewed_at = datetime.utcnow()
        
        # Update the pattern's approval status
        if self.pattern:
            self.pattern.is_approved = True
            self.pattern.approved_at = datetime.utcnow()
        
        db.session.commit()
    
    def reject(self, admin_id, notes=None):
        """Reject the upload"""
        self.status = 'rejected'
        self.reviewed_by = admin_id
        self.review_notes = notes
        self.reviewed_at = datetime.utcnow()
        
        # Update the pattern's approval status
        if self.pattern:
            self.pattern.is_approved = False
        
        db.session.commit()
    
    def to_dict(self, include_pattern=True, include_uploader=True):
        """Convert upload to dictionary"""
        data = {
            'id': self.id,
            'status': self.status,
            'review_notes': self.review_notes,
            'reviewed_at': self.reviewed_at.isoformat() if self.reviewed_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_pattern and self.pattern:
            data['pattern'] = self.pattern.to_dict()
        
        if include_uploader and self.uploader:
            data['uploader'] = {
                'id': self.uploader.id,
                'username': self.uploader.username,
                'email': self.uploader.email
            }
        
        if self.reviewer:
            data['reviewer'] = {
                'id': self.reviewer.id,
                'username': self.reviewer.username
            }
        
        return data
    
    def __repr__(self):
        return f'<Upload {self.id} - {self.status}>'