"""
Platform settings database model for dynamic branding, identity, and configurations.
"""

from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.database import Base

IST = ZoneInfo("Asia/Kolkata")


def ist_now() -> datetime:
    return datetime.now(IST)


class PlatformSetting(Base):
    __tablename__ = "platform_settings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    platform_name: Mapped[str] = mapped_column(String(120), nullable=False, default="Infovet")
    platform_logo_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    favicon_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    tagline: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, default="Professional Career Portal")
    primary_color: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="#6025C5")
    secondary_color: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="#F8F7FC")
    background_color: Mapped[Optional[str]] = mapped_column(String(30), nullable=True, default="#F8F7FC")
    support_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, default="support@infovet.io")
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=ist_now,
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=ist_now,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
    updated_by: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    def __repr__(self) -> str:
        return f"<PlatformSetting(id={self.id}, name='{self.platform_name}')>"

