# EstudioA — AI-Powered Sewing Pattern Platform

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12.8-blue)
![Flask](https://img.shields.io/badge/Flask-3.1.0-green)
![React](https://img.shields.io/badge/React-19-61DAFB)

## Project Overview

EstudioA is a full-stack web platform for sewing patterns with AI-powered search and discovery. Designers upload patterns, users browse and download them, and an admin workflow ensures quality control. The platform features intelligent search, personalized recommendations, favorites, and Google OAuth sign-in.

**Academic Project**
- **Student:** Almuatasim Adib Alfarsi
- **Student ID:** 23F24768
- **Institution:** Middle East College
- **Supervisor:** Dhanalakshmi Venugopal
- **Course:** Bachelor Graduation Project in Computer Science
- **Year:** Fall 2025 / Spring 2026

---

## Features

### Users
- Register / login with username+password or Google OAuth
- Browse and search patterns (fuzzy + semantic AI search)
- Filter by category and difficulty level
- Save patterns to Favorites
- Download pattern PDFs
- Personal account dashboard with download history

### Designers
- Upload sewing patterns (PDF + cover image)
- Auto-suggest tags from title and description
- Track views, downloads, and favorites per pattern
- Dashboard showing approval status for each upload

### Admin
- Approve or reject submitted patterns with detail modals
- Manage user roles and accounts
- View platform-wide statistics (patterns, users, downloads, favorites)

### Security
- Server-side password validation (length, complexity, sequential, repeated, common password blocklist)
- Live frontend password strength feedback (rule-by-rule checklist + strength bar)
- Rate limiting on auth endpoints
- Protected routes (role-based access control)
- JWT authentication with bcrypt password hashing

### Platform
- Email notifications (admin on new upload, designer on approve/reject, users on new publish)
- Role-based routing (user → account, designer → dashboard, admin → admin panel)
- Responsive design with animated flip card pattern browsing
- Glassmorphism design system with CSS design tokens

---

## Technology Stack

### Backend
| | |
|---|---|
| Framework | Flask 3.1.0 |
| Database | MySQL with SQLAlchemy 2.x |
| Authentication | JWT (flask-jwt-extended) + bcrypt |
| Rate Limiting | flask-limiter |
| AI Search | spaCy 3.8.2 + RapidFuzz 3.10.1 |
| OAuth | Google OAuth 2.0 (authorization code flow) |
| Language | Python 3.12.8 |

### Frontend
| | |
|---|---|
| Framework | React 19 |
| Router | React Router v7 |
| Animations | Framer Motion |
| HTTP Client | Axios |
| Build Tool | Vite |
| Styling | Custom CSS design system |

---

## Project Structure

```
EstudioA/
├── backend/
│   ├── models/
│   │   ├── user.py               # User accounts, roles, Google OAuth
│   │   ├── pattern.py            # Patterns, categories, difficulty levels
│   │   ├── favorite.py           # User favorites
│   │   ├── upload.py             # Upload submission tracking
│   │   ├── download_history.py   # Per-user download records
│   │   └── history.py            # View and interaction history
│   ├── routes/
│   │   ├── auth.py               # Register, login, Google OAuth, profile
│   │   ├── patterns.py           # Browse, search, details, view tracking
│   │   ├── upload.py             # File upload (PDF + image)
│   │   ├── admin.py              # Approve/reject, user management, stats
│   │   ├── user.py               # Profile get/update
│   │   ├── favorites.py          # Add/remove/check favorites
│   │   ├── downloads.py          # Download tracking and history
│   │   └── recommendations.py    # Personal and pattern-based suggestions
│   ├── services/
│   │   ├── search_service.py     # Fuzzy + semantic search
│   │   ├── recommendation_service.py  # Content-based + popular recommendations
│   │   ├── password_service.py   # Password validation rules and blocklist
│   │   ├── tag_service.py        # Auto-tag generation
│   │   └── email_service.py      # SMTP notifications
│   ├── app.py                    # Application factory
│   ├── config.py                 # Configuration (reads from .env)
│   ├── seed.py                   # Database seeder
│   ├── .env.example              # Environment variable template
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.jsx / Footer.jsx
│   │   │   ├── FlipCard.jsx            # Pattern card with favorites
│   │   │   ├── PasswordStrength.jsx    # Live password rule checklist + strength bar
│   │   │   ├── PasswordChangeModal.jsx # Change password with live validation
│   │   │   ├── ProtectedRoute.jsx      # Role-based route guard
│   │   │   ├── ConfirmationModal.jsx
│   │   │   ├── BlurText.jsx            # Animated text reveal
│   │   │   ├── Button.jsx / Input.jsx
│   │   │   ├── Toast.jsx               # Self-dismissing notifications
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── Icons.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── BrowsePage.jsx
│   │   │   ├── LoginPage.jsx           # Login, register, Google OAuth
│   │   │   ├── AuthCallbackPage.jsx    # Google OAuth callback handler
│   │   │   ├── PatternDetailPage.jsx
│   │   │   ├── UploadPatternPage.jsx   # Upload with auto-tag suggestions
│   │   │   ├── UserAccountPage.jsx
│   │   │   ├── DesignerDashboardPage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── services/
│   │   │   └── api.js                  # Axios instance + all API namespaces
│   │   ├── utils/
│   │   │   └── validatePassword.js     # Client-side password validation rules
│   │   └── App.jsx
│   ├── .env.example                    # Frontend environment template
│   └── index.html
└── README.md
```

---

## Setup

### Prerequisites
- Python 3.12+
- MySQL 8+
- Node.js 18+
- spaCy model: `python -m spacy download en_core_web_sm`

### Backend

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your values (DB password, Google OAuth keys, etc.)

# Create MySQL database
# mysql> CREATE DATABASE estudioa;

# Seed reference data (run once)
python seed.py

# Start dev server
python app.py
# → http://127.0.0.1:5000
```

### Frontend

```bash
cd frontend

# Configure environment
cp .env.example .env
# Set VITE_GOOGLE_CLIENT_ID if using Google OAuth

npm install
npm run dev
# → http://localhost:5173
```

### Environment Variables

**`backend/.env`**
```
DB_PASSWORD=your_mysql_password
SECRET_KEY=your-flask-secret
JWT_SECRET_KEY=your-jwt-secret

GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Optional — email notifications
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@yourdomain.com
```

**`frontend/.env`**
```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

> For Google OAuth, add `http://localhost:5173/auth/callback` as an Authorized Redirect URI in Google Cloud Console.

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login with username + password |
| POST | `/google` | Google OAuth (exchange code for JWT) |
| GET | `/profile` | Get current user profile |
| POST | `/refresh` | Refresh access token |
| POST | `/change-password` | Change password |

### Patterns — `/api/patterns`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Browse all approved patterns |
| GET | `/<id>` | Pattern details |
| POST | `/` | Create pattern (designer) |
| GET | `/my-patterns` | Designer's own patterns |
| POST | `/<id>/view` | Track a pattern view |
| POST | `/suggest-tags` | Auto-suggest tags |

### Upload — `/api/upload`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/pattern-file` | Upload PDF file |
| POST | `/image` | Upload cover image |

### Favorites — `/api/favorites`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user's favorites |
| POST | `/` | Add to favorites |
| DELETE | `/<pattern_id>` | Remove from favorites |
| GET | `/check/<pattern_id>` | Check if favorited |

### Downloads — `/api/downloads`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/<pattern_id>` | Record a download |
| GET | `/history` | User's download history |

### Recommendations — `/api/recommendations`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Personalized recommendations for current user |
| GET | `/pattern/<id>` | Similar patterns to a given pattern |
| GET | `/popular` | Most downloaded and viewed patterns |

### Admin — `/api/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/patterns/pending` | List pending patterns |
| POST | `/patterns/<id>/approve` | Approve pattern |
| POST | `/patterns/<id>/reject` | Reject pattern |
| GET | `/users` | List all users |
| PUT | `/users/<id>/role` | Change user role |
| GET | `/stats` | Platform statistics |

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `users` | Accounts, roles (`user`/`designer`/`admin`), Google OAuth |
| `patterns` | Pattern metadata, files, approval status |
| `categories` | 8 pattern categories (Dresses, Tops, etc.) |
| `difficulty_levels` | 5 skill levels (Beginner → Expert) |
| `favorites` | User ↔ pattern favorites |
| `uploads` | Submission tracking (designer → pattern) |
| `download_history` | Per-user download records |
| `history` | View and interaction history |

---

## Academic Context

This project demonstrates:
- Full-stack web application development (Flask + React)
- RESTful API design and implementation
- Relational database design with SQLAlchemy ORM
- JWT authentication and role-based access control
- Password security (complexity rules, sequential/repeated detection, common password blocklist)
- API rate limiting and route protection
- Third-party OAuth integration (Google)
- AI/ML integration (NLP search, content-based recommendations, tag generation)
- Email notification systems
- Secure secret management with environment variables

---

## Author

**Almuatasim Adib Alfarsi**
- Email: Almuatsamalfarsi@gmail.com
- Institution: Middle East College, Oman

---

*Last updated: May 2026*
