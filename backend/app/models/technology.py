"""
Technology model representing software stacks, languages, frameworks and tools.
"""

from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Technology(Base):
    __tablename__ = "technologies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(
        String(50),
        default="Backend",
        index=True,
        nullable=False,
    )  # e.g., "Frontend", "Backend", "Mobile", "Database", "Cloud & DevOps", "AI & Automation"
    icon: Mapped[str] = mapped_column(String(100), default="Code", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    display_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

