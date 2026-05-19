import os
import secrets
from datetime import timedelta
from urllib.parse import quote_plus
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = False
    TESTING = False

    _db_password = quote_plus(os.environ.get('DB_PASSWORD', ''))
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or f'mysql+pymysql://root:{_db_password}@localhost/estudioa'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'

    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg'}

    CORS_HEADERS = 'Content-Type'
    CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', 'http://localhost:5173').split(',')

    MAIL_SERVER   = os.environ.get('MAIL_SERVER',   'smtp.gmail.com')
    MAIL_PORT     = int(os.environ.get('MAIL_PORT', '587'))
    MAIL_USE_TLS  = os.environ.get('MAIL_USE_TLS',  'true')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME', '')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD', '')
    ADMIN_EMAIL   = os.environ.get('ADMIN_EMAIL',   '')

    GOOGLE_CLIENT_ID     = os.environ.get('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', '')


class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

    if not os.environ.get('JWT_SECRET_KEY'):
        _generated = secrets.token_hex(64)
        print(
            "\n[WARNING] JWT_SECRET_KEY not set. Using a random secret for this session.\n"
            "          All tokens will be invalidated on restart.\n"
            f"          To persist tokens across restarts, add to your .env file:\n"
            f"          JWT_SECRET_KEY={_generated}\n"
        )
        JWT_SECRET_KEY = _generated


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

    @classmethod
    def validate(cls):
        missing = [k for k in ('JWT_SECRET_KEY', 'SECRET_KEY') if not os.environ.get(k)]
        if missing:
            raise RuntimeError(
                f"Production requires these environment variables: {', '.join(missing)}"
            )


class TestingConfig(Config):
    TESTING = True
    JWT_SECRET_KEY = 'test-secret-not-for-production'
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
