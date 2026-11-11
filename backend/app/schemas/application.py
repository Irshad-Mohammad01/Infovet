"""
Pydantic schemas for candidate job applications.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.job import JobOut


class ApplicationCreate(BaseModel):
    job_id: int
    full_name: str = Field(..., min_length=1, max_length=120)
    email: EmailStr = Field(..., max_length=255)
    phone: Optional[str] = Field(default=None, max_length=30)
    resume_url: str = Field(..., min_length=1, max_length=500)
    cover_note: Optional[str] = None
    portfolio_url: Optional[str] = Field(default=None, max_length=255)
    linkedin_url: Optional[str] = Field(default=None, max_length=255)


class ApplicationStatusUpdate(BaseModel):
    status: str = Field(..., description="pending, reviewed, shortlisted, rejected, accepted")
    admin_notes: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    user_id: int
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    resume_url: str
    cover_note: Optional[str] = None
    portfolio_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    status: str
    admin_notes: Optional[str] = None
    applied_at: datetime
    updated_at: datetime
    job: Optional[JobOut] = None

    model_config = ConfigDict(from_attributes=True)

