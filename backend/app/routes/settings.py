"""
Public configuration and branding routes.
Does not expose sensitive environment secrets or private administrative data.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.platform_setting import PlatformSettingPublic
from app.services.settings import get_or_create_platform_settings

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("/public", response_model=PlatformSettingPublic)
def get_public_settings(db: Session = Depends(get_db)) -> PlatformSettingPublic:
    """
    Returns public platform branding, active logo URL, and contact coordinates.
    Cached or fetched dynamically from Neon PostgreSQL.
    """
    record = get_or_create_platform_settings(db)
    return PlatformSettingPublic.model_validate(record)

