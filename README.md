# EstudioA - AI-Driven Fashion Pattern Platform

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Python](https://img.shields.io/badge/Python-3.12.8-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.0-green)

## 📋 Project Overview

EstudioA is a modern web-based platform for sewing patterns that leverages artificial intelligence to enhance pattern discovery and management. The platform provides intelligent search, personalized recommendations, and a community-driven upload system with administrative moderation.

**Academic Project**
- **Student:** Almuatasim Adib Alfarsi
- **Student ID:** 23F24768
- **Institution:** Middle East College
- **Supervisor:** Dhanalakshmi Venugopal
- **Course:** Web Application in Computer Science
- **Date:** January 2026

## 🎯 Key Features

- **AI-Powered Fuzzy Search**: Tolerant search using NLP and RapidFuzz
- **Smart Recommendations**: Content-based pattern suggestions
- **User Authentication**: Secure JWT-based authentication
- **Pattern Management**: Upload, browse, and download sewing patterns
- **Admin Moderation**: Review and approve user-submitted patterns
- **Category System**: 8 pattern categories (Dresses, Tops, Bottoms, etc.)
- **Difficulty Levels**: 5 skill levels (Beginner to Expert)

## 🛠️ Technology Stack

### Backend
- **Framework:** Flask 3.1.0
- **Database:** MySQL 9.5.0
- **ORM:** SQLAlchemy 2.0.35
- **Authentication:** JWT (flask-jwt-extended)
- **AI/ML:** spaCy 3.8.2, RapidFuzz 3.10.1
- **Language:** Python 3.12.8

### Frontend (Planned)
- **Framework:** React.js
- **Styling:** Tailwind CSS
- **Build Tool:** Vite

## 📁 Project Structure
```
EstudioA/
├── backend/                 # Flask backend
│   ├── models/             # Database models
│   │   ├── user.py        # User model
│   │   ├── pattern.py     # Pattern, Category, DifficultyLevel
│   │   ├── upload.py      # Upload tracking
│   │   └── history.py     # User history
│   ├── routes/            # API endpoints (in development)
│   ├── services/          # Business logic (in development)
│   ├── utils/             # Helper functions (in development)
│   ├── app.py            # Main application
│   ├── config.py         # Configuration
│   ├── seed.py           # Database seeding script
│   └── requirements.txt  # Python dependencies
├── frontend/             # React frontend (planned)
└── database/            # SQL scripts
```

## 🚀 Current Status

### Completed ✅
- [x] Backend architecture design
- [x] Database schema implementation
- [x] All 6 database tables created
- [x] Database models with relationships
- [x] Database seeding (8 categories, 5 difficulty levels)
- [x] Flask application setup
- [x] Configuration system
- [x] MySQL database connection

### In Development 🚧
- [ ] Authentication API routes
- [ ] Pattern browsing and search routes
- [ ] Upload management routes
- [ ] Admin moderation routes
- [ ] AI-powered fuzzy search
- [ ] Recommendation engine
- [ ] Frontend React application

## 💾 Database Schema

The system uses 6 main tables:
- **users**: User accounts and authentication
- **categories**: Pattern categories (8 default categories)
- **difficulty_levels**: Skill level ratings (5 levels)
- **patterns**: Sewing pattern metadata and files
- **uploads**: Pattern submission tracking
- **history**: User interaction history

## 🔧 Setup Instructions

### Prerequisites
- Python 3.12.8
- MySQL 9.5.0
- Node.js 25.2.1 (for frontend)
- Git 2.50.1

### Backend Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/EstudioA.git
cd EstudioA/backend
```

2. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
pip install cryptography
```

4. Configure database:
- Update `config.py` with your MySQL credentials
- Create database: `CREATE DATABASE estudioa;`

5. Seed the database:
```bash
python seed.py
```

6. Run the application:
```bash
python app.py
```

The backend will be available at `http://127.0.0.1:5000`

## 📝 API Documentation (Planned)

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Pattern Endpoints
- `GET /api/patterns` - Browse all patterns
- `GET /api/patterns/:id` - Get pattern details
- `GET /api/patterns/search` - Search patterns
- `POST /api/patterns/download/:id` - Download pattern

### Upload Endpoints
- `POST /api/uploads` - Submit new pattern
- `GET /api/uploads/my` - Get user's uploads

### Admin Endpoints
- `GET /api/admin/uploads/pending` - Review pending uploads
- `POST /api/admin/uploads/:id/approve` - Approve pattern
- `POST /api/admin/uploads/:id/reject` - Reject pattern

## 🎓 Academic Context

This project serves as a practical demonstration of:
- Full-stack web application development
- Database design and implementation
- RESTful API architecture
- AI/ML integration in web applications
- User authentication and authorization
- Agile development methodology
- Version control with Git

## 📄 License

This project is submitted as academic coursework at Middle East College.

## 👤 Author

**Almuatasim Adib Alfarsi**
- Email: Almuatsamalfarsi@gmail.com
- Institution: Middle East College, Oman

---

**Last Updated:** January 22, 2026