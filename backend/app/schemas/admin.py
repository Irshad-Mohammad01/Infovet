"""
Pydantic schemas for admin dashboard statistics and administrative controls.
"""

from typing import List, Optional

from pydantic import BaseModel

from app.schemas.application import ApplicationOut
from app.schemas.auth import UserOut
from app.schemas.job import JobOut


class AdminDashboardStats(BaseModel):
    total_jobs: int
    active_jobs: int
    total_applications: int
    total_users: int
    total_categories: int
    recent_applications: List[ApplicationOut] = []
    recent_jobs: List[JobOut] = []


class AdminUserStatusUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None

