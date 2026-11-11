"""
SQLAlchemy engine, session factory, and declarative Base.

Database-agnostic configuration supporting Neon PostgreSQL, SQLite, MySQL, and other
relational databases supported by SQLAlchemy ORM.
"""

from collections.abc import Generator
from typing import Any

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import settings


def get_engine_args(db_url: str) -> dict[str, Any]:
    args: dict[str, Any] = {}
    if "libsql" in db_url:
        try:
            import sqlalchemy_libsql  # noqa: F401
        except ImportError:
            pass
        connect_args: dict[str, Any] = {"check_same_thread": False}
        if settings.turso_auth_token and settings.turso_auth_token.strip():
            connect_args["auth_token"] = settings.turso_auth_token.strip()
        args["connect_args"] = connect_args
        args["pool_pre_ping"] = True
        args["pool_recycle"] = settings.db_pool_recycle
    elif db_url.startswith("sqlite"):
        args["connect_args"] = {"check_same_thread": False}
    else:
        # Optimized connection pooling for serverless PostgreSQL (e.g., Neon)
        args["pool_pre_ping"] = True
        args["pool_recycle"] = settings.db_pool_recycle
        args["pool_size"] = settings.db_pool_size
        args["max_overflow"] = settings.db_max_overflow
        args["pool_timeout"] = settings.db_pool_timeout
    return args


engine = create_engine(settings.database_url, **get_engine_args(settings.database_url))
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency: one database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
