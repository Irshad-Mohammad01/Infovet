# INFOVET — Local Execution & Development Guide

This guide walks you through running the complete **INFOVET** platform (FastAPI Python Backend + React 18 / Vite Frontend + Neon PostgreSQL) on your local machine.

---

## 1. System Credentials & Access Points

| Component | URL / Location | Credentials / Notes |
| :--- | :--- | :--- |
| **Public Job Portal** | [http://localhost:5173](http://localhost:5173) | Free public access; candidate signup at `/register` |
| **Admin Console** | [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | **Email:** `admin@inofovet.in` (or `admin@infovet.io`)<br>**Password:** `Admin@123456` |
| **FastAPI Backend Base** | [http://127.0.0.1:8000](http://127.0.0.1:8000) | ASGI Uvicorn Server |
| **Interactive Swagger API Docs** | [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) | Full API testing console with Bearer token support |
| **ReDoc API Documentation** | [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc) | Clean specification viewer |
| **Database** | Neon Serverless PostgreSQL | Connected via `DATABASE_URL` in `backend/.env` |

---

## 2. Start the Backend API Server

Open a terminal window and run:

```bash
# 1. Navigate to the backend directory
cd /home/irshad-mohammad/Music/Infovet/backend

# 2. Activate Python virtual environment
source .venv/bin/activate

# 3. Start the Uvicorn ASGI server with hot reloading
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

When started successfully, you will see:
```text
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Application startup complete.
```

---

## 3. Start the Frontend Application

Open a **second terminal window** and run:

```bash
# 1. Navigate to the frontend directory
cd /home/irshad-mohammad/Music/Infovet/frontend

# 2. Start Vite development server
npm run dev
```

When started, Vite will output:
```text
  VITE v4.5.14  ready in 150 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> [!NOTE]
> Vite proxies any request made to `/api/*` directly to `http://127.0.0.1:8000`. You do not need any manual CORS configuration or additional proxy tools.

---

## 4. Key Application Features & Pages

### Candidate / Job Seeker Experience:
- **Home (`/`):** Hero search bar, dynamic category chips, featured jobs, latest postings, platform metrics, and value props.
- **Browse Jobs (`/jobs`):** Full multi-filter search (category, workplace type, experience level, salary range, keyword search, and pagination).
- **Job Details (`/jobs/:id`):** In-depth role requirements, responsibilities, compensation breakdown, bookmark toggle, and apply button.
- **Job Application (`/jobs/:id/apply`):** One-click application using stored candidate profile or direct resume upload (`.pdf`, `.doc`, `.docx`).
- **Application Tracker (`/my-applications`):** Real-time candidate pipeline stages (`pending` → `reviewed` → `shortlisted` → `accepted` / `rejected`) and interviewer notes.
- **Application Detail (`/applications/:id`):** Full candidate submission summary and recruiter feedback.
- **Saved Jobs (`/saved-jobs`):** Bookmarked career opportunities.
- **Candidate Profile (`/profile` & `/profile/edit`):** Bio, phone, location, avatar upload, portfolio link, LinkedIn link, and default resume.
- **Change Password (`/profile/change-password`):** Secure credential updating.
- **Contact (`/contact`):** Preserved contact form with bot-suppression honeypot, storing inquiries to the Neon database.

### Administrator Console:
- **Admin Login (`/admin/login`):** Restricted portal for administrators only.
- **Dashboard (`/admin/dashboard`):** Real-time system counters (Total Jobs, Active Listings, Applicants, Registered Users, Categories) and latest activities.
- **Manage Jobs (`/admin/jobs`):** Search, table view, active/inactive toggles, direct deletion modal.
- **Add / Edit Job (`/admin/jobs/new` & `/admin/jobs/:id/edit`):** Full form for salary, qualifications, workplace type, deadlines, and featured status.
- **Applicants Management (`/admin/applicants`):** Filter by job and status, quick stage updates, resume inspection, and evaluator notes.
- **User Management (`/admin/users`):** Manage candidate accounts, suspend/reactivate accounts, and promote roles.
- **Category Management (`/admin/categories`):** Add, update, and reorder job categories.
- **System Settings (`/admin/settings`):** Live database connection indicator, SMTP status (Simulated vs Live), upload limits, and JWT lifetime.

---

## 5. Development & Testing Commands

### Run Backend Unit & Integration Tests:
```bash
cd /home/irshad-mohammad/Music/Infovet/backend
source .venv/bin/activate
python -m pytest
```

### Build Frontend for Production:
```bash
cd /home/irshad-mohammad/Music/Infovet/frontend
npm run build
```

### Apply New Database Migrations (if adding models):
```bash
cd /home/irshad-mohammad/Music/Infovet/backend
source .venv/bin/activate
python -m alembic upgrade head
```

### Reseed Sample Data (Optional):
```bash
cd /home/irshad-mohammad/Music/Infovet/backend
source .venv/bin/activate
python seed_data.py
```

---

## 6. Troubleshooting

1. **Port 8000 Conflict:**
   If port 8000 is occupied, run uvicorn on another port:
   `python -m uvicorn app.main:app --port 8001 --reload`
   *(Remember to update `frontend/vite.config.js` proxy if you change the backend port)*.

2. **Database Connectivity:**
   Verify `DATABASE_URL` in `backend/.env`. Check health status at `http://127.0.0.1:8000/api/health`.

3. **Stopping the Applications:**
   Press `Ctrl + C` in both terminal windows to gracefully terminate the servers.
