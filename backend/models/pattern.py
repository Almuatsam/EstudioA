from models import db
from datetime import datetime


class Category(db.Model):
    __tablename__ = 'categories'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patterns = db.relationship('Pattern', backref='category', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

    def __repr__(self):
        return f'<Category {self.name}>'


class DifficultyLevel(db.Model):
    __tablename__ = 'difficulty_levels'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.Text)
    order = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    patterns = db.relationship('Pattern', backref='difficulty', lazy='dynamic')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'order': self.order
        }

    def __repr__(self):
        return f'<DifficultyLevel {self.name}>'


class Pattern(db.Model):
    __tablename__ = 'patterns'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)

    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    difficulty_id = db.Column(db.Integer, db.ForeignKey('difficulty_levels.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)  # tracks uploader

    pdf_file = db.Column(db.String(255), nullable=False)
    preview_image = db.Column(db.String(255))
    tags = db.Column(db.Text)
    designer_name = db.Column(db.String(100))

    is_approved = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    download_count = db.Column(db.Integer, default=0)
    view_count = db.Column(db.Integer, default=0)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    approved_at = db.Column(db.DateTime)

    uploads = db.relationship('Upload', backref='pattern', lazy='dynamic')
    history = db.relationship('History', backref='pattern', lazy='dynamic')

    def increment_downloads(self):
        self.download_count += 1
        db.session.commit()

    def increment_views(self):
        self.view_count += 1
        db.session.commit()

    def get_tags_list(self):
        if self.tags:
            return [tag.strip() for tag in self.tags.split(',')]
        return []

    def set_tags_list(self, tags_list):
        if tags_list:
            self.tags = ', '.join(tags_list)
        else:
            self.tags = ''

    def to_dict(self, include_stats=True):
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'category': self.category.to_dict() if self.category else None,
            'difficulty': self.difficulty.to_dict() if self.difficulty else None,
            'pdf_file': self.pdf_file,
            'preview_image': self.preview_image,
            'tags': self.get_tags_list(),
            'designer_name': self.designer_name,
            'is_approved': self.is_approved,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'approved_at': self.approved_at.isoformat() if self.approved_at else None
        }
        if include_stats:
            data['download_count'] = self.download_count
            data['view_count'] = self.view_count
        return data

    def __repr__(self):
        return f'<Pattern {self.title}>'
