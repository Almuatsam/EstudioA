from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Import all models to ensure they're registered with SQLAlchemy
from models.user import User
from models.pattern import Pattern, Category, DifficultyLevel
from models.upload import Upload
from models.history import History
from models.favorite import Favorite  
from models.download_history import DownloadHistory  