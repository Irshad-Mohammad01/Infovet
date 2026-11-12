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
from app.routes.company_admin import (
    delete_inquiry,
    get_inquiry_by_id,
    list_admin_inquiries,
    update_inquiry_status,
)
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

# Direct aliases for /api/inquiries and /api/admin/inquiries
inquiry_alias_router = APIRouter(prefix="/api/inquiries", tags=["company"])


@inquiry_alias_router.post("", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
def submit_project_inquiry_alias(
    payload: ProjectInquiryCreate,
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    return submit_project_inquiry(payload=payload, db=db)


app.include_router(inquiry_alias_router)

admin_inquiry_alias_router = APIRouter(prefix="/api/admin/inquiries", tags=["admin-company"])


@admin_inquiry_alias_router.get("", response_model=List[ProjectInquiryOut])
def list_admin_inquiries_alias(
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ProjectInquiryOut]:
    return list_admin_inquiries(status_filter=status, search=search, current_admin=current_admin, db=db)


@admin_inquiry_alias_router.get("/{inquiry_id}", response_model=ProjectInquiryOut)
def get_inquiry_by_id_alias(
    inquiry_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    return get_inquiry_by_id(inquiry_id=inquiry_id, current_admin=current_admin, db=db)


@admin_inquiry_alias_router.patch("/{inquiry_id}", response_model=ProjectInquiryOut)
@admin_inquiry_alias_router.put("/{inquiry_id}", response_model=ProjectInquiryOut)
def update_inquiry_status_alias(
    inquiry_id: int,
    payload: ProjectInquiryUpdateAdmin,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    return update_inquiry_status(inquiry_id=inquiry_id, payload=payload, current_admin=current_admin, db=db)


@admin_inquiry_alias_router.delete("/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry_alias(
    inquiry_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return delete_inquiry(inquiry_id=inquiry_id, current_admin=current_admin, db=db)


app.include_router(admin_inquiry_alias_router)

