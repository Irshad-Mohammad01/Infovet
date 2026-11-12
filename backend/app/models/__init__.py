"""
SQLAlchemy database models for INFOVATE Software Development Company.
Preserves existing Contact and historical models while providing modern software company models.
"""

from app.models.application import Application
from app.models.category import Category
from app.models.company import CompanyProfile
from app.models.contact import Contact
from app.models.job import Job
from app.models.media_asset import MediaAsset
from app.models.platform_setting import PlatformSetting
from app.models.project import Project, ProjectImage
from app.models.project_inquiry import ProjectInquiry
from app.models.saved_job import SavedJob
from app.models.service import Service
from app.models.team_member import TeamMember
from app.models.technology import Technology
from app.models.testimonial import Testimonial
from app.models.user import User

__all__ = [
    "Contact",
    "User",
    "Category",
    "Job",
    "Application",
    "SavedJob",
    "PlatformSetting",
    "CompanyProfile",
    "Service",
    "Technology",
    "Project",
    "ProjectImage",
    "Testimonial",
    "TeamMember",
    "ProjectInquiry",
    "MediaAsset",
]
