"""
INFOVATE Python Backend Application.

FastAPI backend providing:
- Authentication & Candidate profiles (JWT + bcrypt)
- Job discovery, search, filtering & bookmarking
- Candidate job applications with resume uploads
- Comprehensive Admin Dashboard & CRUD management
- Preserved contact inquiries and background notifications
"""

from contextlib import asynccontextmanager
import logging
from pathlib import Path

from typing import List, Optional
from fastapi import APIRouter, Depends, FastAPI, Query, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.config import settings
from app.core.security import get_current_admin
from app.database import get_db
from app.models.user import User
from app.schemas.company import (
    ProjectInquiryCreate,
    ProjectInquiryOut,
    ProjectInquiryUpdateAdmin,
)
from app.routes.company import submit_project_inquiry
from app.routes import (
    admin_router,
    applications_router,
    auth_router,
    company_admin_router,
    company_router,
    contact_router,
    jobs_router,
    saved_jobs_router,
    settings_router,
    uploads_router,
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s [%(name)s] %(message)s",
)
logger = logging.getLogger("infovate.api")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Ensure upload directories exist
    upload_path = Path(settings.upload_dir)
    for sub in ["resumes", "avatars", "logos", "projects", "services", "team", "media", "attachments"]:
        (upload_path / sub).mkdir(parents=True, exist_ok=True)
    logger.info("INFOVATE Software Company API initialized successfully in %s mode.", settings.environment)

    if not settings.is_email_configured:
        logger.info("SMTP is unconfigured: email notifications will be simulated in server logs.")

    yield


app = FastAPI(
    title="INFOVATE Software Development Company API",
    description="Production REST API for INFOVATE — Software Development & IT Solutions Company.",
    version="3.0.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["system"])
def health_check():
    """Lightweight platform health check endpoint."""
    return {"status": "ok", "app": "INFOVATE API"}


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global safe error handler: never leak internal stack traces or connection strings."""
    logger.error("Unhandled exception processing %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please try again later."},
    )


# CORS Configuration
allowed_origins = settings.get_allowed_origins()
logger.info("Configuring CORS with origins: %s", allowed_origins)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_origin_regex=r"https:\/\/.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept"],
)

# Mount all feature routers
app.include_router(company_router)
app.include_router(company_admin_router)
app.include_router(settings_router)
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(saved_jobs_router)
app.include_router(uploads_router)
app.include_router(admin_router)
app.include_router(contact_router)

# Universal Inquiry submission endpoints (/inquiries, /inquiries/, /api/inquiries, /api/inquiries/)
inquiry_alias_router = APIRouter(tags=["company"])


@inquiry_alias_router.post("/inquiries", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
@inquiry_alias_router.post("/inquiries/", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
@inquiry_alias_router.post("/api/inquiries", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
@inquiry_alias_router.post("/api/inquiries/", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
def submit_project_inquiry_alias(
    payload: ProjectInquiryCreate,
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    return submit_project_inquiry(payload=payload, db=db)


app.include_router(inquiry_alias_router)

