"""
ProjectInquiry model representing incoming software development and project inquiries.
"""

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ProjectInquiry(Base):
    __tablename__ = "project_inquiries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    company_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    company: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    project_type: Mapped[Optional[str]] = mapped_column(String(100), default="General Inquiry", nullable=True)
    estimated_budget: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    expected_timeline: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    timeline: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    project_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default="New",
        index=True,
        nullable=False,
    )  # "New", "Contacted", "In Discussion", "Proposal Sent", "Converted", "Closed"
    internal_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    inquiry_type: Mapped[str] = mapped_column(String(50), default="general", nullable=False, index=True)
    subject: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

