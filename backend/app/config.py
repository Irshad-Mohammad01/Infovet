"""
Application configuration loaded from environment variables and backend/.env.

Zero hardcoded credentials: all database and SMTP settings are strictly read
from the environment or local .env file.
"""

from functools import lru_cache
import json
import os
from typing import Optional, Union

from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # --- Platform & Server --------------------------------------------------
    environment: str = Field(default="development", description="Runtime environment")
    port: int = Field(default_factory=lambda: int(os.getenv("PORT", "8000")), description="Server port")

    # --- Database -----------------------------------------------------------
    # Fully provider-agnostic. Supports Neon PostgreSQL, SQLite, MySQL, etc. via SQLAlchemy.
    # Examples:
    #   postgresql://user:pass@host/dbname?sslmode=require
    #   sqlite:///./hexmap.db
    database_url: str = Field(
        default="sqlite:///./hexmap.db",
        description="SQLAlchemy database connection URL",
    )
    db_pool_size: int = Field(default=10, description="Database connection pool size")
    db_max_overflow: int = Field(default=20, description="Maximum overflow connections")
    db_pool_timeout: int = Field(default=30, description="Pool connection acquisition timeout (seconds)")
    db_pool_recycle: int = Field(default=300, description="Connection recycle interval (seconds)")

    # --- Turso / libSQL Database (Legacy Support) ---------------------------
    turso_database_url: Optional[str] = Field(default=None)
    turso_auth_token: Optional[str] = Field(default=None)

    @field_validator("database_url", mode="after")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        if not v:
            return v
        # Providers like Neon or Render sometimes output 'postgres://', which SQLAlchemy
        # expects as 'postgresql://'
        if v.startswith("postgres://"):
            v = v.replace("postgres://", "postgresql://", 1)

        # Handle postgresql+psycopg:// (Psycopg 3) fallback if psycopg 3 is not installed
        if v.startswith("postgresql+psycopg://"):
            try:
                import psycopg  # noqa: F401
            except ImportError:
                # Fallback to standard psycopg2
                v = v.replace("postgresql+psycopg://", "postgresql://", 1)

        # Handle postgresql:// fallback if psycopg2 is missing but psycopg 3 is installed
        elif v.startswith("postgresql://") and not v.startswith("postgresql+"):
            try:
                import psycopg2  # noqa: F401
            except ImportError:
                try:
                    import psycopg  # noqa: F401
                    v = v.replace("postgresql://", "postgresql+psycopg://", 1)
                except ImportError:
                    pass

        if v.startswith("libsql://"):
            normalized = "sqlite+libsql://" + v[len("libsql://"):]
            if "secure=" not in normalized:
                sep = "&" if "?" in normalized else "?"
                normalized = f"{normalized}{sep}secure=true"
            return normalized
        return v

    @model_validator(mode="after")
    def resolve_database_config(self) -> "Settings":
        if self.turso_database_url and self.turso_database_url.strip():
            raw_url = self.turso_database_url.strip()
            is_remote = not (
                raw_url.startswith("file:")
                or raw_url.startswith("sqlite:///")
                or raw_url.startswith("sqlite+libsql:///")
            )
            has_token = bool(self.turso_auth_token and self.turso_auth_token.strip())
            if is_remote and not has_token:
                raise ValueError(
                    "TURSO_AUTH_TOKEN is required when configuring a remote TURSO_DATABASE_URL"
                )

            if raw_url.startswith("libsql://"):
                normalized = "sqlite+libsql://" + raw_url[len("libsql://"):]
            elif raw_url.startswith("https://"):
                normalized = "sqlite+libsql://" + raw_url[len("https://"):]
            elif raw_url.startswith("http://"):
                normalized = "sqlite+libsql://" + raw_url[len("http://"):]
            elif raw_url.startswith("sqlite+libsql://"):
                normalized = raw_url
            else:
                normalized = f"sqlite+libsql://{raw_url}"

            if is_remote and "secure=" not in normalized:
                sep = "&" if "?" in normalized else "?"
                normalized = f"{normalized}{sep}secure=true"

            self.database_url = normalized
        return self

    # --- JWT Authentication -------------------------------------------------
    jwt_secret_key: str = Field(
        default="infovet-jwt-development-secret-key-change-in-production-env-32chars",
        description="JWT HMAC secret key",
    )
    jwt_algorithm: str = Field(default="HS256", description="JWT signing algorithm")
    access_token_expire_minutes: int = Field(
        default=60 * 24 * 7,  # 7 days
        description="Access token lifespan in minutes",
    )

    # --- File Uploads -------------------------------------------------------
    upload_dir: str = Field(default="uploads", description="Base directory for uploaded files")
    max_upload_size_mb: int = Field(default=10, description="Max upload file size in megabytes")

    # --- Frontend & CORS ----------------------------------------------------
    frontend_url: Optional[str] = None
    cors_origins: Union[list[str], str] = Field(
        default_factory=lambda: [
            "http://localhost:5173",
            "http://localhost:4173",
            "http://127.0.0.1:5173",
        ]
    )

    @field_validator("cors_origins", mode="after")
    @classmethod
    def parse_cors_origins(cls, v: Union[list[str], str]) -> list[str]:
        if isinstance(v, str):
            v_stripped = v.strip()
            if v_stripped.startswith("[") and v_stripped.endswith("]"):
                try:
                    return json.loads(v_stripped)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    def get_allowed_origins(self) -> list[str]:
        origins = list(self.cors_origins) if isinstance(self.cors_origins, list) else []
        if self.frontend_url:
            clean_url = self.frontend_url.strip().rstrip("/")
            if clean_url and clean_url not in origins:
                origins.append(clean_url)
        return origins

    # --- SMTP Configuration (Prepared - Inactive by default) ----------------
    smtp_host: str = Field(default="", description="SMTP host server")
    smtp_port: int = Field(default=587, description="SMTP server port")
    smtp_username: Optional[str] = Field(default=None, description="SMTP auth username")
    smtp_user: Optional[str] = Field(default=None)  # Backward compat alias
    smtp_password: str = Field(default="", description="SMTP auth password")
    smtp_sender_email: Optional[str] = Field(default=None, description="Sender email address")
    smtp_from: Optional[str] = Field(default=None)  # Backward compat alias
    smtp_sender_name: str = Field(default="Infovet", description="Sender display name")
    smtp_use_tls: bool = Field(default=True, description="Enable STARTTLS")
    smtp_starttls: Optional[bool] = Field(default=None)  # Backward compat alias
    smtp_use_ssl: bool = Field(default=False, description="Enable SSL")
    contact_receiver_email: Optional[str] = None
    notify_email: Optional[str] = None

    @property
    def effective_smtp_user(self) -> str:
        return (self.smtp_username or self.smtp_user or "").strip()

    @property
    def effective_sender_email(self) -> str:
        return (
            self.smtp_sender_email
            or self.smtp_from
            or self.effective_smtp_user
            or "no-reply@infovet.io"
        ).strip()

    @property
    def effective_sender_name(self) -> str:
        return self.smtp_sender_name or "Infovet"

    @property
    def effective_use_tls(self) -> bool:
        if self.smtp_starttls is not None:
            return self.smtp_starttls
        return self.smtp_use_tls

    @property
    def effective_receiver_email(self) -> str:
        return (self.contact_receiver_email or self.notify_email or self.effective_sender_email).strip()

    @property
    def is_email_configured(self) -> bool:
        """Email is active if an SMTP host and receiver/sender are provided."""
        return bool(self.smtp_host and self.smtp_host.strip() and self.effective_receiver_email)

    # --- Abuse Limits / Rate Limiting ---------------------------------------
    rate_limit_max: int = 5
    rate_limit_window_seconds: int = 3600


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
