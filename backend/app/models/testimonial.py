"""
Testimonial model representing client reviews and endorsements.
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    client_name: Mapped[str] = mapped_column(String(150), nullable=False)
    client_company: Mapped[str] = mapped_column(String(150), nullable=False)
    client_role: Mapped[str] = mapped_column(String(100), default="Founder / CEO", nullable=False)
    client_avatar_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    rating: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    project_title: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

