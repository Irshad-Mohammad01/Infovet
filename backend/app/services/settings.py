"""
Service for platform branding and settings management.
"""

from typing import Optional
from sqlalchemy.orm import Session
from app.models.platform_setting import PlatformSetting
from app.schemas.platform_setting import PlatformSettingUpdate


def get_or_create_platform_settings(db: Session) -> PlatformSetting:
    """Retrieves the active platform settings singleton or creates the initial record."""
    settings_record = db.query(PlatformSetting).order_by(PlatformSetting.id.asc()).first()
    if not settings_record:
        settings_record = PlatformSetting(
            platform_name="Infovate",
            platform_logo_url=None,
            favicon_url=None,
            tagline="Enterprise Software & IT Solutions",
            primary_color="#6025C5",
            secondary_color="#F8F7FC",
            background_color="#F8F7FC",
            support_email="support@infovate.io",
            contact_phone=None,
        )
        db.add(settings_record)
        db.commit()
        db.refresh(settings_record)
    return settings_record


def update_platform_settings(
    db: Session,
    payload: PlatformSettingUpdate,
    admin_email: Optional[str] = None,
) -> PlatformSetting:
    """Updates the active platform settings record."""
    settings_record = get_or_create_platform_settings(db)
    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(settings_record, field, value)

    if admin_email:
        settings_record.updated_by = admin_email

    db.commit()
    db.refresh(settings_record)
    return settings_record

