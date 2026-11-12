"""
Job listing database model for Infovate.
"""

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional
from zoneinfo import ZoneInfo

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database import Base

IST = ZoneInfo("Asia/Kolkata")


def ist_now() -> datetime:
    return datetime.now(IST)


if TYPE_CHECKING:
    from app.models.application import Application
    from app.models.category import Category
    from app.models.saved_job import SavedJob


class Job(Base):
    __tablename__ = "jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    company_name: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    company_logo: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    company_website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    location: Mapped[str] = mapped_column(String(120), nullable=False, default="Remote")
    workplace_type: Mapped[str] = mapped_column(String(30), nullable=False, default="Remote", index=True)  # Remote, On-site, Hybrid
    job_type: Mapped[str] = mapped_column(String(30), nullable=False, default="Full-time", index=True)     # Full-time, Part-time, Contract, Internship
    experience_level: Mapped[str] = mapped_column(String(30), nullable=False, default="Mid Level", index=True)  # Entry Level, Mid Level, Senior Level, Director / Lead
    salary_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_max: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    salary_currency: Mapped[str] = mapped_column(String(10), nullable=False, default="INR")
    salary_is_negotiable: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    category_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("categories.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    description: Mapped[str] = mapped_column(Text, nullable=False)
    requirements: Mapped[str] = mapped_column(Text, nullable=False)
    benefits: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    tags: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # Comma-separated tags

    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True, index=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    views_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    deadline: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

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

    # Relationships
    category: Mapped[Optional["Category"]] = relationship(
        "Category",
        back_populates="jobs",
    )
    applications: Mapped[List["Application"]] = relationship(
        "Application",
        back_populates="job",
        cascade="all, delete-orphan",
    )
    saved_by_users: Mapped[List["SavedJob"]] = relationship(
        "SavedJob",
        back_populates="job",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Job(id={self.id}, title='{self.title}', company='{self.company_name}')>"

