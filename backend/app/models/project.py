"""
Project & ProjectImage models for INFOVET software portfolio.
"""

from datetime import date, datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(
        String(100),
        default="Web Application",
        index=True,
        nullable=False,
    )  # e.g., "Web Application", "Mobile App", "SaaS Platform", "E-Commerce", "Custom Software", "AI & Automation"
    client_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    short_description: Mapped[str] = mapped_column(Text, nullable=False)
    full_description: Mapped[str] = mapped_column(Text, nullable=False)
    objectives: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    features: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    technologies: Mapped[List[str]] = mapped_column(JSON, default=list, nullable=False)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    live_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    github_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    completion_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="Completed", nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, index=True, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

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

    images: Mapped[List["ProjectImage"]] = relationship(
        "ProjectImage",
        back_populates="project",
        cascade="all, delete-orphan",
        order_by="ProjectImage.display_order",
    )


class ProjectImage(Base):
    __tablename__ = "project_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    project_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        index=True,
        nullable=False,
    )
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    caption: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    project: Mapped["Project"] = relationship("Project", back_populates="images")

