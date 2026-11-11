"""
File upload endpoints for company assets, project images, team photos, attachments, and logos.
"""

from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.core.security import get_current_active_user, get_current_admin
from app.models.user import User
from app.services.storage import storage_service

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


# ---------------------------------------------------------------------------
# Upload Endpoints
# ---------------------------------------------------------------------------
@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    url = await storage_service.save_resume(file)
    return {"url": url, "filename": file.filename}


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    url = await storage_service.save_avatar(file)
    return {"url": url}


@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    url = await storage_service.save_logo(file)
    return {"url": url, "filename": file.filename}


@router.post("/project-image")
async def upload_project_image(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    url = await storage_service.save_project_image(file)
    return {"url": url, "filename": file.filename}


@router.post("/service-image")
async def upload_service_image(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    url = await storage_service.save_service_image(file)
    return {"url": url, "filename": file.filename}


@router.post("/team-photo")
async def upload_team_photo(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    url = await storage_service.save_team_photo(file)
    return {"url": url, "filename": file.filename}


@router.post("/media")
async def upload_media_asset(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    url, filename, size_bytes = await storage_service.save_media(file)
    return {"url": url, "filename": filename, "size": size_bytes}


@router.post("/attachment")
async def upload_attachment(
    file: UploadFile = File(...),
) -> dict:
    url = await storage_service.save_attachment(file)
    return {"url": url, "filename": file.filename}


# ---------------------------------------------------------------------------
# Safe Static File Delivery
# ---------------------------------------------------------------------------
def _safe_serve(directory: Path, filename: str) -> FileResponse:
    safe_name = Path(filename).name
    file_path = directory / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
    return FileResponse(file_path)


@router.get("/resumes/{filename}")
def serve_resume(filename: str):
    return _safe_serve(storage_service.resumes_dir, filename)


@router.get("/avatars/{filename}")
def serve_avatar(filename: str):
    return _safe_serve(storage_service.avatars_dir, filename)


@router.get("/logos/{filename}")
def serve_logo(filename: str):
    return _safe_serve(storage_service.logos_dir, filename)


@router.get("/projects/{filename}")
def serve_project_image(filename: str):
    return _safe_serve(storage_service.projects_dir, filename)


@router.get("/services/{filename}")
def serve_service_image(filename: str):
    return _safe_serve(storage_service.services_dir, filename)


@router.get("/team/{filename}")
def serve_team_photo(filename: str):
    return _safe_serve(storage_service.team_dir, filename)


@router.get("/media/{filename}")
def serve_media(filename: str):
    return _safe_serve(storage_service.media_dir, filename)


@router.get("/attachments/{filename}")
def serve_attachment(filename: str):
    return _safe_serve(storage_service.attachments_dir, filename)
