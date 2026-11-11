"""
SQLAlchemy database models for the Infovet application.
Preserves existing Contact model and exports all new Infovet portal models.
"""

from app.models.application import Application
from app.models.category import Category
from app.models.contact import Contact
from app.models.job import Job
from app.models.platform_setting import PlatformSetting
from app.models.saved_job import SavedJob
from app.models.user import User

__all__ = [
    "Contact",
    "User",
    "Category",
    "Job",
    "Application",
    "SavedJob",
    "PlatformSetting",
]
