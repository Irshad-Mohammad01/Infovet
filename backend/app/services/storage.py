"""
Configurable file storage service for software portfolio assets, project images, team photos, and inquiry attachments.
"""

from pathlib import Path
import re
import secrets
from typing import Optional, Set
import uuid

from fastapi import HTTPException, UploadFile, status

from app.config import settings

ALLOWED_DOC_EXTENSIONS: Set[str] = {".pdf", ".doc", ".docx", ".zip"}
ALLOWED_IMAGE_EXTENSIONS: Set[str] = {".jpg", ".jpeg", ".png", ".webp", ".svg"}


class StorageService:
    def __init__(self, base_dir: Optional[str] = None) -> None:
        self.base_dir = Path(base_dir or settings.upload_dir)
        self.resumes_dir = self.base_dir / "resumes"
        self.avatars_dir = self.base_dir / "avatars"
        self.logos_dir = self.base_dir / "logos"
        self.projects_dir = self.base_dir / "projects"
        self.services_dir = self.base_dir / "services"
        self.team_dir = self.base_dir / "team"
        self.media_dir = self.base_dir / "media"
        self.attachments_dir = self.base_dir / "attachments"
        self._ensure_dirs()

    def _ensure_dirs(self) -> None:
        for d in [
            self.resumes_dir,
            self.avatars_dir,
            self.logos_dir,
            self.projects_dir,
            self.services_dir,
            self.team_dir,
            self.media_dir,
            self.attachments_dir,
        ]:
            d.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def _sanitize_extension(filename: str) -> str:
        ext = Path(filename).suffix.lower()
        if not re.match(r"^\.[a-z0-9]{1,10}$", ext):
            return ""
        return ext

    async def _save_image(self, file: UploadFile, target_dir: Path, prefix: str, max_mb: int = 10) -> str:
        if not file.filename:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file is missing.",
            )
        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid image type '{ext}'. Allowed formats are PNG, JPG, JPEG, WEBP, and SVG.",
            )
        content = await file.read()
        max_bytes = max_mb * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {max_mb}MB.",
            )
        unique_name = f"{prefix}_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = target_dir / unique_name
        with open(destination, "wb") as f:
            f.write(content)
        return unique_name

    async def save_resume(self, file: UploadFile) -> str:
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is missing.")
        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_DOC_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid file type '{ext}'.")
        content = await file.read()
        unique_name = f"resume_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.resumes_dir / unique_name
        with open(destination, "wb") as f:
            f.write(content)
        return f"/api/uploads/resumes/{unique_name}"

    async def save_avatar(self, file: UploadFile) -> str:
        name = await self._save_image(file, self.avatars_dir, "avatar", max_mb=5)
        return f"/api/uploads/avatars/{name}"

    async def save_logo(self, file: UploadFile) -> str:
        name = await self._save_image(file, self.logos_dir, "logo", max_mb=5)
        return f"/api/uploads/logos/{name}"

    async def save_project_image(self, file: UploadFile) -> str:
        name = await self._save_image(file, self.projects_dir, "project", max_mb=10)
        return f"/api/uploads/projects/{name}"

    async def save_service_image(self, file: UploadFile) -> str:
        name = await self._save_image(file, self.services_dir, "service", max_mb=5)
        return f"/api/uploads/services/{name}"

    async def save_team_photo(self, file: UploadFile) -> str:
        name = await self._save_image(file, self.team_dir, "team", max_mb=5)
        return f"/api/uploads/team/{name}"

    async def save_media(self, file: UploadFile) -> tuple[str, str, int]:
        """Saves media and returns (url, filename, size_bytes)."""
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is missing.")
        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_IMAGE_EXTENSIONS and ext not in ALLOWED_DOC_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Unsupported file format '{ext}'.")
        content = await file.read()
        unique_name = f"media_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.media_dir / unique_name
        with open(destination, "wb") as f:
            f.write(content)
        return f"/api/uploads/media/{unique_name}", unique_name, len(content)

    async def save_attachment(self, file: UploadFile) -> str:
        if not file.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="File is missing.")
        ext = self._sanitize_extension(file.filename)
        if ext not in ALLOWED_DOC_EXTENSIONS and ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Invalid attachment type '{ext}'.")
        content = await file.read()
        unique_name = f"inquiry_{uuid.uuid4().hex[:12]}_{secrets.token_hex(4)}{ext}"
        destination = self.attachments_dir / unique_name
        with open(destination, "wb") as f:
            f.write(content)
        return f"/api/uploads/attachments/{unique_name}"


storage_service = StorageService()
