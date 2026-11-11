"""
Tests for Turso / libSQL database configuration, URL normalization, and security.
"""

import pytest
from pydantic import ValidationError
from sqlalchemy import create_engine

from app.config import Settings
from app.database import get_engine_args


def test_turso_config_normalization_libsql_scheme():
    """Verify libsql:// scheme is converted to sqlite+libsql:// with secure=true."""
    settings = Settings(
        turso_database_url="libsql://my-org-db.turso.io",
        turso_auth_token="secret-jwt-token-123",
    )
    assert settings.database_url == "sqlite+libsql://my-org-db.turso.io?secure=true"
    assert settings.turso_auth_token == "secret-jwt-token-123"


def test_turso_config_normalization_https_scheme():
    """Verify https:// scheme is converted to sqlite+libsql:// with secure=true."""
    settings = Settings(
        turso_database_url="https://my-org-db.turso.io",
        turso_auth_token="secret-jwt-token-123",
    )
    assert settings.database_url == "sqlite+libsql://my-org-db.turso.io?secure=true"


def test_turso_config_normalization_raw_host():
    """Verify raw hostname is converted to sqlite+libsql:// with secure=true."""
    settings = Settings(
        turso_database_url="my-org-db.turso.io",
        turso_auth_token="secret-jwt-token-123",
    )
    assert settings.database_url == "sqlite+libsql://my-org-db.turso.io?secure=true"


def test_turso_remote_requires_auth_token():
    """Verify configuring remote Turso without auth token raises ValidationError."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            turso_database_url="libsql://my-org-db.turso.io",
            turso_auth_token="",
        )
    assert "TURSO_AUTH_TOKEN is required" in str(exc_info.value)


def test_turso_empty_env_falls_back_to_database_url():
    """Verify empty TURSO_DATABASE_URL preserves standard DATABASE_URL."""
    settings = Settings(
        database_url="sqlite:///./hexmap.db",
        turso_database_url="",
        turso_auth_token="",
    )
    assert settings.database_url == "sqlite:///./hexmap.db"


def test_get_engine_args_for_libsql(monkeypatch):
    """Verify get_engine_args passes auth_token via connect_args without exposing in URL."""
    import app.database

    monkeypatch.setattr(app.database.settings, "turso_auth_token", "super-secret-token-xyz")

    args = get_engine_args("sqlite+libsql://my-org-db.turso.io?secure=true")
    assert args["pool_pre_ping"] is True
    assert args["pool_recycle"] == 300
    assert args["connect_args"]["check_same_thread"] is False
    assert args["connect_args"]["auth_token"] == "super-secret-token-xyz"


def test_libsql_engine_url_does_not_leak_token(monkeypatch):
    """Verify SQLAlchemy engine creation does not include the auth token in engine.url."""
    import app.database

    secret = "do-not-leak-this-token"
    monkeypatch.setattr(app.database.settings, "turso_auth_token", secret)

    db_url = "sqlite+libsql://my-org-db.turso.io?secure=true"
    engine_args = get_engine_args(db_url)
    engine = create_engine(db_url, **engine_args)

    # The auth token must NOT appear in engine.url or str(engine.url)
    assert secret not in str(engine.url)
    assert secret not in str(engine)


def test_postgres_url_normalization_and_driver_fallback():
    """Verify postgres:// and postgresql+psycopg:// normalize properly for SQLAlchemy."""
    # 1. postgres:// converts to postgresql://
    s1 = Settings(database_url="postgres://user:pass@host/db", turso_database_url=None)
    assert s1.database_url == "postgresql://user:pass@host/db"

    # 2. postgresql+psycopg:// automatically falls back to postgresql:// if psycopg 3 is not installed
    s2 = Settings(database_url="postgresql+psycopg://user:pass@host/db", turso_database_url=None)
    assert s2.database_url == "postgresql://user:pass@host/db"

