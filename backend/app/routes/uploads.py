"""
File upload endpoints for candidate resumes and user profile avatars.
"""

from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse

from app.core.security import get_current_active_user, get_current_admin
from app.models.user import User
from app.services.storage import storage_service

router = APIRouter(prefix="/api/uploads", tags=["uploads"])


@router.post("/resume")
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Uploads a candidate resume document (PDF, DOC, DOCX)."""
    url = await storage_service.save_resume(file)
    return {"url": url, "filename": file.filename}


@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
) -> dict:
    """Uploads a candidate or user profile image."""
    url = await storage_service.save_avatar(file)
    return {"url": url}


@router.post("/logo")
async def upload_logo(
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
) -> dict:
    """Uploads a platform branding logo (PNG, JPG, SVG, WEBP). Requires administrator privileges."""
    url = await storage_service.save_logo(file)
    return {"url": url, "filename": file.filename}


@router.get("/resumes/{filename}")
def serve_resume(filename: str):
    """Safely serves an uploaded resume file."""
    # Sanitize against path traversal
    safe_name = Path(filename).name
    file_path = storage_service.resumes_dir / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="File not found.")
    return FileResponse(file_path)


@router.get("/avatars/{filename}")
def serve_avatar(filename: str):
    """Safely serves an uploaded avatar image."""
    safe_name = Path(filename).name
    file_path = storage_service.avatars_dir / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    return FileResponse(file_path)


@router.get("/logos/{filename}")
def serve_logo(filename: str):
    """Safely serves an uploaded platform logo image."""
    safe_name = Path(filename).name
    file_path = storage_service.logos_dir / safe_name
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Logo not found.")
    return FileResponse(file_path)

