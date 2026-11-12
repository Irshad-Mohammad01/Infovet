"""
Pydantic schemas for platform settings and dynamic branding.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class PlatformSettingPublic(BaseModel):
    """Publicly exposed platform settings for frontend branding."""
    platform_name: str = Field(default="Infovate", max_length=120)
    platform_logo_url: Optional[str] = Field(default=None, max_length=500)
    favicon_url: Optional[str] = Field(default=None, max_length=500)
    tagline: Optional[str] = Field(default=None, max_length=255)
    primary_color: Optional[str] = Field(default="#6025C5", max_length=30)
    secondary_color: Optional[str] = Field(default="#F8F7FC", max_length=30)
    background_color: Optional[str] = Field(default="#F8F7FC", max_length=30)
    support_email: Optional[str] = Field(default="support@infovate.io", max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=50)

    model_config = ConfigDict(from_attributes=True)


class PlatformSettingUpdate(BaseModel):
    """Admin update payload for platform settings."""
    platform_name: Optional[str] = Field(default=None, min_length=1, max_length=120)
    platform_logo_url: Optional[str] = Field(default=None, max_length=500)
    favicon_url: Optional[str] = Field(default=None, max_length=500)
    tagline: Optional[str] = Field(default=None, max_length=255)
    primary_color: Optional[str] = Field(default=None, max_length=30)
    secondary_color: Optional[str] = Field(default=None, max_length=30)
    background_color: Optional[str] = Field(default=None, max_length=30)
    support_email: Optional[str] = Field(default=None, max_length=255)
    contact_phone: Optional[str] = Field(default=None, max_length=50)


class PlatformSettingOut(PlatformSettingPublic):
    """Detailed platform settings with metadata for administration."""
    id: int
    created_at: datetime
    updated_at: datetime
    updated_by: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

