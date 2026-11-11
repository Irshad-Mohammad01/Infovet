"""
Routes package for Infovet API.
"""

from app.routes.admin import router as admin_router
from app.routes.applications import router as applications_router
from app.routes.auth import router as auth_router
from app.routes.contact import router as contact_router
from app.routes.jobs import router as jobs_router
from app.routes.saved_jobs import router as saved_jobs_router
from app.routes.settings import router as settings_router
from app.routes.uploads import router as uploads_router

__all__ = [
    "admin_router",
    "applications_router",
    "auth_router",
    "contact_router",
    "jobs_router",
    "saved_jobs_router",
    "settings_router",
    "uploads_router",
]
