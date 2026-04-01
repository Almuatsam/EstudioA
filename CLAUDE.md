# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EstudioA is a full-stack sewing pattern platform with AI-powered search. It is an academic graduation project (Bachelor CS, Middle East College). The stack is Flask (Python) backend + React (Vite) frontend communicating over a REST API.

---

## Commands

### Backend

```bash
cd backend

# Activate virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
pip install cryptography

# Seed the database (run once after DB creation)
python seed.py

# Run dev server (http://127.0.0.1:5000)
python app.py

# Run tests
python test_routes.py
python test_upload.py
```

The backend requires a local MySQL instance. Database name: `estudioa`. Credentials are hardcoded in `config.py` (root / A1103@2003a). The spaCy model must be downloaded separately: `python -m spacy download en_core_web_sm`.

### Frontend

```bash
cd frontend

npm install
npm run dev       # Dev server (http://localhost:5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

---

## Architecture

### Backend (`backend/`)

Flask application factory pattern in `app.py`. Configuration classes in `config.py` (Development / Production / Testing).

**Blueprints** (all registered under `/api/`):
| Prefix | File | Purpose |
|---|---|---|
| `/api/auth` | `routes/auth.py` | Register, login, logout, change-password |
| `/api/patterns` | `routes/patterns.py` | Browse, search, details, my-patterns |
| `/api/upload` | `routes/upload.py` | File upload (PDF + image) |
| `/api/admin` | `routes/admin.py` | Approve/reject patterns, user management |
| `/api/user` | `routes/user.py` | Profile get/update |
| `/api/favorites` | `routes/favorites.py` | Add/remove/check favorites |
| `/api/downloads` | `routes/downloads.py` | Track downloads, history |
| `/api/recommendations` | `routes/recommendations.py` | Personal & pattern-based recommendations |

Static uploaded files are served directly by Flask at `/uploads/<path:filename>`.

**Models** (SQLAlchemy, MySQL):
- `User` — accounts, roles (`user` / `designer` / `admin`), bcrypt passwords
- `Pattern` — core entity; `is_approved` gates public visibility; `tags` stored as comma-separated text, use `get_tags_list()` / `set_tags_list()`
- `Category`, `DifficultyLevel` — seeded reference data (8 categories, 5 levels)
- `Upload` — submission tracking (links user → pattern)
- `Favorite`, `DownloadHistory`, `History` — user interaction records

**AI Search** (`services/search_service.py`):
- `fuzzy_search_patterns()` — RapidFuzz string similarity on title + tags (threshold 60)
- `semantic_search_patterns()` — spaCy `en_core_web_sm` cosine similarity on description (threshold 0.5)
- `search_patterns()` — combines both, deduplicates by keeping highest score, returns top-N

### Frontend (`frontend/src/`)

React 19 + React Router v7 SPA. No global state library — auth state lives in `context/AuthContext.jsx`.

**Auth flow**: `AuthProvider` wraps the entire app inside `<BrowserRouter>`. On mount it calls `GET /api/auth/profile` with the stored JWT. Login/register navigate based on role: `admin` → `/admin`, `designer` → `/designer-dashboard`, user → `/account`.

**API layer** (`services/api.js`): A single axios instance with a request interceptor that attaches `Authorization: Bearer <token>` from `localStorage`. All API namespaces (`authAPI`, `patternsAPI`, `uploadAPI`, `adminAPI`, `favoritesAPI`, `downloadsAPI`, `userAPI`, `recommendationsAPI`) are exported from this file.

**Key pages**:
- `BrowsePage` — filter by category/difficulty (radio inputs), search; category/difficulty IDs come from API as integers but `e.target.value` returns strings — the `==` loose equality in the `checked` prop is intentional
- `PatternDetailPage` — tracks views on mount, handles PDF download via direct URL
- `DesignerDashboardPage` — shows designer's own uploads and their approval status
- `AdminPage` — approve/reject pending patterns, manage users
- `UploadPatternPage` — two-step upload (file first via `/api/upload/pattern-file`, then pattern metadata via `POST /api/patterns`)

**Component conventions**: Each component has a paired `.css` file (e.g., `Button.jsx` + `Button.css`). Shared reusable components: `Button`, `Input`, `Toast`, `LoadingSpinner`, `FlipCard`, `GenderIcon`, `ConfirmationModal`, `PasswordChangeModal`. `Toast` is self-dismissing; pass `{ message, type }` state to it.

### File Storage

Uploaded files land in `backend/uploads/` with subdirectories for patterns (`patterns/`) and images (`images/`). The frontend constructs full URLs as `http://127.0.0.1:5000/uploads/<path>`.
