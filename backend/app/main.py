"""
INFOVET Python Backend Application.

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

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routes import (
    admin_router,
    applications_router,
    auth_router,
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
logger = logging.getLogger("infovet.api")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Ensure upload directories exist
    upload_path = Path(settings.upload_dir)
    (upload_path / "resumes").mkdir(parents=True, exist_ok=True)
    (upload_path / "avatars").mkdir(parents=True, exist_ok=True)
    (upload_path / "logos").mkdir(parents=True, exist_ok=True)
    logger.info("INFOVET API initialized successfully in %s mode.", settings.environment)

    if not settings.is_email_configured:
        logger.info("SMTP is unconfigured: email notifications will be simulated in server logs.")

    yield


app = FastAPI(
    title="INFOVET Job Portal API",
    description="Production REST API for INFOVET — Professional Job Portal.",
    version="2.0.0",
    lifespan=lifespan,
)


@app.get("/health", tags=["system"])
def health_check():
    """Lightweight platform health check endpoint."""
    return {"status": "ok", "app": "INFOVET API"}


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
app.include_router(settings_router)
app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(applications_router)
app.include_router(saved_jobs_router)
app.include_router(uploads_router)
app.include_router(admin_router)
app.include_router(contact_router)
