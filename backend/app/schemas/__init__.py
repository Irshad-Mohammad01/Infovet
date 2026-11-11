"""
Pydantic validation schemas for Infovet API requests and responses.
"""

from app.schemas.admin import AdminDashboardStats, AdminUserStatusUpdate
from app.schemas.application import (
    ApplicationCreate,
    ApplicationOut,
    ApplicationStatusUpdate,
)
from app.schemas.auth import (
    OTPVerify,
    PasswordChange,
    Token,
    UserLogin,
    UserOut,
    UserProfileUpdate,
    UserRegister,
)
from app.schemas.category import (
    CategoryCreate,
    CategoryOut,
    CategoryUpdate,
)
from app.schemas.contact import ContactCreate, SimpleMessage
from app.schemas.job import (
    JobCreate,
    JobListResponse,
    JobOut,
    JobUpdate,
)

__all__ = [
    "AdminDashboardStats",
    "AdminUserStatusUpdate",
    "ApplicationCreate",
    "ApplicationOut",
    "ApplicationStatusUpdate",
    "CategoryCreate",
    "CategoryOut",
    "CategoryUpdate",
    "ContactCreate",
    "JobListResponse",
    "JobCreate",
    "JobOut",
    "JobUpdate",
    "OTPVerify",
    "PasswordChange",
    "SimpleMessage",
    "Token",
    "UserLogin",
    "UserOut",
    "UserProfileUpdate",
    "UserRegister",
]
