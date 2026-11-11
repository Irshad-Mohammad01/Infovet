# HexMap Contact Backend API

A simple, robust Python FastAPI backend for HexMap.
It serves only one purpose: receives form submissions from the existing HexMap Contact Us form, validates the data, stores it in the configured database via SQLAlchemy ORM, and optionally dispatches an SMTP email notification.

---

## 1. Minimal Architecture

```text
Visitor
   ↓
Existing HexMap Contact Us Form
   ↓
Python FastAPI Backend (POST /api/contact)
   ├── 1. Honeypot check (rejects bots filling hidden 'website' field)
   ├── 2. In-memory per-IP rate limiting (5 submissions/hr)
   ├── 3. Pydantic request validation (EmailStr, lengths)
   │
   ├── 4. Stage 1: Database Storage (SQLAlchemy ORM)
   │      └── Table: contacts (`id`, `name`, `email`, `subject`, `message`, `created_at`)
   │
   └── 5. Stage 2: Asynchronous SMTP Email Notification (Optional)
          └── Independent background task: mail failure NEVER rolls back the database record!
```

There is intentionally **NO**:
- Admin panel / Admin dashboard
- Admin authentication / JWT / users / passwords
- Public API for reading submitted messages (No `GET /contacts`, no `GET /contacts/{id}`)
- Unnecessary CRUD endpoints or management UI

---

## 2. Directory Structure

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI app factory, CORS, exception handlers
│   ├── config.py                # Environment configuration using pydantic-settings
│   ├── database.py              # Provider-agnostic SQLAlchemy engine & session factory
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   └── contact.py           # Contact model (`id`, `name`, `email`, `subject`, `message`, `created_at`)
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── contact.py           # ContactCreate & SimpleMessage schemas
│   │
│   ├── routes/
│   │   ├── __init__.py
│   │   └── contact.py           # POST /api/contact & GET /api/health
│   │
│   └── services/
│       ├── __init__.py
│       ├── email.py             # Isolated SMTP service with timeouts & retries
│       └── rate_limiter.py      # Basic per-IP spam protection
│
├── alembic/
│   ├── env.py                   # Migration runner reading DATABASE_URL
│   ├── script.py.mako
│   └── versions/
│       └── 0001_create_contacts_table.py
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Test fixtures & test client
│   ├── test_contact.py          # Valid, invalid email, honeypot rejection, rate limit, read API absence
│   └── test_smtp_and_db_errors.py # SMTP failure isolation & DB error safety
│
├── alembic.ini
├── requirements.txt
├── .env
├── .env.example
├── .gitignore
└── README.md
```

---

## 3. Database Switching (SQLAlchemy Agnostic)

The backend is completely database-provider agnostic and configurable purely via `DATABASE_URL`:

- **PostgreSQL / Neon / Azure**:
  ```env
  DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
  ```
- **Local SQLite**:
  ```env
  DATABASE_URL=sqlite:///./hexmap.db
  ```
- **MySQL**:
  ```env
  DATABASE_URL=mysql+pymysql://username:password@host:5432/database
  ```

### Database Table Schema

```text
contacts
---------
id         Integer, Primary Key, Autoincrement
name       Varchar(120), Not Null
email      Varchar(255), Not Null, Indexed
subject    Varchar(200), Not Null
message    Text, Not Null
created_at DateTime(timezone=True), Not Null
```

---

## 4. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Example |
|---|---|---|
| `DATABASE_URL` | SQLAlchemy database URL | `postgresql://user:pass@host:5432/database?sslmode=require` |
| `FRONTEND_URL` | Allowed frontend origin | `http://localhost:5173` |
| `CORS_ORIGINS` | JSON list or comma-separated origins | `["http://localhost:5173","http://localhost:4173","http://127.0.0.1:5173"]` |
| `SMTP_HOST` | SMTP server hostname (leave blank to disable email) | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port | `587` |
| `SMTP_USERNAME` | SMTP login username | `your-email@gmail.com` |
| `SMTP_PASSWORD` | SMTP login password / App Password | `xxxx xxxx xxxx xxxx` |
| `SMTP_STARTTLS` | Enable STARTTLS | `true` |
| `SMTP_FROM` | Outgoing sender address | `HexMap Website <no-reply@hexmap.io>` |
| `CONTACT_RECEIVER_EMAIL` | Inbox to receive submission alerts | `contact@hexmap.io` |
| `RATE_LIMIT_MAX` | Max submissions per IP per window | `5` |
| `RATE_LIMIT_WINDOW_SECONDS`| Rate limiting window in seconds | `3600` |

---

## 5. Running the Backend

```bash
cd backend

# 1. Activate virtual environment
source .venv/bin/activate       # On Windows: .venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
alembic upgrade head

# 4. Start the server
uvicorn app.main:app --reload --port 8000
```

---

## 6. Frontend Contract

- **Endpoint**: `POST /api/contact`
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@company.com",
    "subject": "Project Inquiry",
    "message": "We need help building our web application.",
    "website": ""
  }
  ```
- **Honeypot Validation**: The `website` field is hidden from real visitors. If filled by a bot, the request is rejected with `400 Bad Request` and never stored in the database.
- **Success Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "Thanks — your message has been received. We usually reply within a couple of working days."
  }
  ```
- **Validation Failure (422 Unprocessable Entity)**:
  Returns formatted field-level errors consumed by `frontend/src/services/api.js`.

---

## 7. Running Tests

```bash
pytest tests/ -v
```

Verifies:
1. Valid submission saving to DB & scheduling email notification
2. Invalid email rejection (422)
3. Missing fields rejection (422)
4. Bot honeypot rejection (400) without database insertion
5. Per-IP rate limiting (429)
6. Absence of public contact read endpoints (404/405)
7. Health check endpoint (200)
8. Independent SMTP failure handling (database submission is never lost)
9. Controlled database error handling without leaking credentials or stack traces
