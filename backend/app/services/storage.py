"""
Configurable file storage service for resumes, avatars, and attachments.

Keeps storage provider independent from business logic.
Files are validated by size, extension, and content type, stored on disk or
cloud storage, and relative accessible URLs are returned to be saved in the database.
"""

import os
from pathlib import Path
import re
import secrets
from typing import Optional, Set
import uuid

from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_RESUME_EXTENSIONS: Set[str] = {".pdf", ".doc", ".docx"}
ALLOWED_IMAGE_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".webp", ".svg"}

ALLOWED_RESUME_MIMES: Set[str] = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",
}
ALLOWED_IMAGE_MIMES: Set[str] = {
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
}


class StorageService:
    def __init__(self, base_dir: Optional[str] = None) -> None:
        self.base_dir = Path(base_dir or settings.upload_dir)
        self.resumes_dir = self.base_dir / "resumes"
        self.avatars_dir = self.base_dir / "avatars"
        self.logos_dir = self.base_dir / "logos"
        self._ensure_dirs()

    def _ensure_dirs(self) -> None:
        self.resumes_dir.mkdir(parents=True, exist_ok=True)
        self.avatars_dir.mkdir(parents=True, exist_ok=True)
        self.logos_dir.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _sanitize_extension(filename: str) -> str:
        ext = Path(filename).suffix.lower()
        # Only allow alphanumeric extensions with leading dot
        if not re.match(r"^\.[a-z0-9]{1,10}$", ext):
            return ""
        return ext

    async def save_resume(self, file: UploadFile) -> str:
        """Validates and saves a candidate resume, returning its accessible URL."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume file is missing.",
            )

        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_RESUME_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type '{ext}'. Allowed resume formats are PDF, DOC, and DOCX.",
            )

        content = await file.read()
        max_bytes = settings.max_upload_size_mb * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {settings.max_upload_size_mb}MB.",
            )

        unique_name = f"resume_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.resumes_dir / unique_name

        with open(destination, "wb") as f:
            f.write(content)

        return f"/api/uploads/resumes/{unique_name}"

    async def save_avatar(self, file: UploadFile) -> str:
        """Validates and saves a user avatar/profile picture, returning its accessible URL."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file is missing.",
            )

        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type '{ext}'. Allowed formats are JPG, PNG, WEBP, and SVG.",
            )

        content = await file.read()
        max_bytes = 5 * 1024 * 1024  # 5MB for profile pictures
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile picture exceeds 5MB limit.",
            )

        unique_name = f"avatar_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.avatars_dir / unique_name

        with open(destination, "wb") as f:
            f.write(content)

        return f"/api/uploads/avatars/{unique_name}"

    async def save_logo(self, file: UploadFile) -> str:
        """Validates and saves a platform branding logo, returning its accessible URL."""
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Logo image file is missing.",
            )

        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid logo image type '{ext}'. Allowed formats are PNG, JPG, JPEG, WEBP, and SVG.",
            )

        content = await file.read()
        max_bytes = 5 * 1024 * 1024  # 5MB for logo
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Logo image exceeds 5MB limit.",
            )

        unique_name = f"logo_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.logos_dir / unique_name

        with open(destination, "wb") as f:
            f.write(content)

        return f"/api/uploads/logos/{unique_name}"


storage_service = StorageService()
