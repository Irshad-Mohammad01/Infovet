"""
Pydantic schemas for job categories.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class CategoryBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    slug: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = None
    icon: str = Field(default="Briefcase", max_length=50)
    is_active: bool = True
    display_order: int = 0


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=100)
    slug: Optional[str] = Field(default=None, max_length=120)
    description: Optional[str] = None
    icon: Optional[str] = Field(default=None, max_length=50)
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class CategoryOut(CategoryBase):
    id: int
    slug: str
    created_at: datetime
    jobs_count: Optional[int] = 0

    model_config = ConfigDict(from_attributes=True)

