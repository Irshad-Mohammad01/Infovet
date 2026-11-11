"""
Pydantic schemas for job postings, filters, and responses.
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.category import CategoryOut


class JobBase(BaseModel):
    title: str = Field(..., min_length=2, max_length=180)
    slug: Optional[str] = Field(default=None, max_length=200)
    company_name: str = Field(..., min_length=1, max_length=120)
    company_logo: Optional[str] = Field(default=None, max_length=500)
    company_website: Optional[str] = Field(default=None, max_length=255)
    location: str = Field(default="Remote", max_length=120)
    workplace_type: str = Field(default="Remote", max_length=30)  # Remote, On-site, Hybrid
    job_type: str = Field(default="Full-time", max_length=30)     # Full-time, Part-time, Contract, Internship
    experience_level: str = Field(default="Mid Level", max_length=30)  # Entry Level, Mid Level, Senior Level, Director / Lead
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = Field(default="INR", max_length=10)
    salary_is_negotiable: bool = False
    category_id: Optional[int] = None
    description: str = Field(..., min_length=10)
    requirements: str = Field(..., min_length=10)
    benefits: Optional[str] = None
    tags: Optional[str] = None
    is_active: bool = True
    is_featured: bool = False
    deadline: Optional[datetime] = None


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=2, max_length=180)
    slug: Optional[str] = Field(default=None, max_length=200)
    company_name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    company_logo: Optional[str] = Field(default=None, max_length=500)
    company_website: Optional[str] = Field(default=None, max_length=255)
    location: Optional[str] = Field(default=None, max_length=120)
    workplace_type: Optional[str] = Field(default=None, max_length=30)
    job_type: Optional[str] = Field(default=None, max_length=30)
    experience_level: Optional[str] = Field(default=None, max_length=30)
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: Optional[str] = Field(default=None, max_length=10)
    salary_is_negotiable: Optional[bool] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    benefits: Optional[str] = None
    tags: Optional[str] = None
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None
    deadline: Optional[datetime] = None


class JobOut(JobBase):
    id: int
    slug: str
    views_count: int = 0
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryOut] = None
    is_saved: Optional[bool] = False
    has_applied: Optional[bool] = False

    model_config = ConfigDict(from_attributes=True)


class JobListResponse(BaseModel):
    items: List[JobOut]
    total: int
    page: int
    size: int
    pages: int

