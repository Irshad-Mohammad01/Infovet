"""
Company Profile model for INFOVATE Software Development Company.
Stores dynamic company details, mission, vision, statistics, and coordinates.
"""

from datetime import datetime, timezone
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class CompanyProfile(Base):
    __tablename__ = "company_profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company_name: Mapped[str] = mapped_column(String(120), default="INFOVATE", nullable=False)
    tagline: Mapped[str] = mapped_column(
        String(255),
        default="We Build Digital Solutions That Move Businesses Forward.",
        nullable=False,
    )
    short_description: Mapped[str] = mapped_column(
        Text,
        default="INFOVATE is a modern software development startup and digital engineering partner.",
        nullable=False,
    )
    about_markdown: Mapped[str] = mapped_column(
        Text,
        default="We design, build, and scale high-performance custom software, modern web applications, mobile platforms, and automated digital systems for ambitious businesses worldwide.",
        nullable=False,
    )
    mission: Mapped[str] = mapped_column(
        Text,
        default="To empower enterprises and forward-thinking startups with dependable, scalable, and beautifully engineered software solutions.",
        nullable=False,
    )
    vision: Mapped[str] = mapped_column(
        Text,
        default="To be a premier global software engineering partner renowned for innovation, quality craftsmanship, and client success.",
        nullable=False,
    )
    experience_years: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    projects_completed: Mapped[int] = mapped_column(Integer, default=45, nullable=False)
    satisfied_clients: Mapped[int] = mapped_column(Integer, default=38, nullable=False)
    primary_email: Mapped[str] = mapped_column(String(120), default="contact@infovate.in", nullable=False)
    phone: Mapped[str] = mapped_column(String(50), default="+91 98765 43210", nullable=False)
    address: Mapped[str] = mapped_column(String(255), default="Bengaluru, Karnataka, India", nullable=False)
    linkedin_url: Mapped[str] = mapped_column(String(255), default="https://linkedin.com/company/infovate", nullable=True)
    github_url: Mapped[str] = mapped_column(String(255), default="https://github.com/infovate", nullable=True)
    twitter_url: Mapped[str] = mapped_column(String(255), default="https://twitter.com/infovate", nullable=True)

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

