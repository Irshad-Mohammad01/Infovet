"""
Administrative management endpoints for Infovet.
All endpoints (except login) require role='admin' authorization.
"""

import math
import re
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.config import settings
from app.core.security import (
    create_access_token,
    get_current_admin,
    verify_password,
)
from app.database import get_db
from app.models.application import Application
from app.models.category import Category
from app.models.job import Job
from app.models.user import User
from app.schemas.admin import AdminDashboardStats, AdminUserStatusUpdate
from app.schemas.application import ApplicationOut, ApplicationStatusUpdate
from app.schemas.auth import Token, UserLogin, UserOut
from app.schemas.category import CategoryCreate, CategoryOut, CategoryUpdate
from app.schemas.job import JobCreate, JobListResponse, JobOut, JobUpdate
from app.schemas.platform_setting import PlatformSettingOut, PlatformSettingUpdate
from app.services.email import send_application_status_update_email
from app.services.settings import (
    get_or_create_platform_settings,
    update_platform_settings,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])


def _slugify(text: str) -> str:
    """Helper to convert title to URL slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_-]+", "-", text)
    return text.strip("-")


# --- Admin Authentication ---------------------------------------------------
@router.post("/login", response_model=Token)
def admin_login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    """Authenticates an administrator account against the database."""
    email_clean = payload.email.lower().strip()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid administrator credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not have administrator permissions.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This administrator account has been deactivated.",
        )

    token = create_access_token(subject=user.id, role="admin")
    return Token(access_token=token, token_type="bearer", user=UserOut.model_validate(user))


# --- Admin Dashboard Statistics ---------------------------------------------
@router.get("/stats", response_model=AdminDashboardStats)
def get_dashboard_stats(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> AdminDashboardStats:
    """Returns platform metrics for the admin dashboard."""
    total_jobs = db.query(func.count(Job.id)).scalar() or 0
    active_jobs = db.query(func.count(Job.id)).filter(Job.is_active.is_(True)).scalar() or 0
    total_applications = db.query(func.count(Application.id)).scalar() or 0
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_categories = db.query(func.count(Category.id)).scalar() or 0

    recent_apps = (
        db.query(Application)
        .options(joinedload(Application.job))
        .order_by(Application.applied_at.desc())
        .limit(5)
        .all()
    )

    recent_jobs = (
        db.query(Job)
        .options(joinedload(Job.category))
        .order_by(Job.created_at.desc())
        .limit(5)
        .all()
    )

    return AdminDashboardStats(
        total_jobs=total_jobs,
        active_jobs=active_jobs,
        total_applications=total_applications,
        total_users=total_users,
        total_categories=total_categories,
        recent_applications=[ApplicationOut.model_validate(a) for a in recent_apps],
        recent_jobs=[JobOut.model_validate(j) for j in recent_jobs],
    )


# --- Job Management (CRUD) --------------------------------------------------
@router.get("/jobs", response_model=JobListResponse)
def list_admin_jobs(
    q: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, description="active, inactive, all"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> JobListResponse:
    """Lists all jobs (active and inactive) for administrative management."""
    query = db.query(Job).options(joinedload(Job.category))

    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(or_(Job.title.ilike(term), Job.company_name.ilike(term)))

    if status_filter == "active":
        query = query.filter(Job.is_active.is_(True))
    elif status_filter == "inactive":
        query = query.filter(Job.is_active.is_(False))

    query = query.order_by(Job.created_at.desc())

    total = query.count()
    total_pages = math.ceil(total / size) if total > 0 else 1
    jobs = query.offset((page - 1) * size).limit(size).all()

    return JobListResponse(
        items=[JobOut.model_validate(j) for j in jobs],
        total=total,
        page=page,
        size=size,
        pages=total_pages,
    )


@router.post("/jobs", response_model=JobOut, status_code=status.HTTP_201_CREATED)
def create_job(
    payload: JobCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> JobOut:
    """Creates a new job posting."""
    slug = payload.slug.strip() if payload.slug else _slugify(payload.title)
    # Ensure unique slug
    base_slug = slug
    counter = 1
    while db.query(Job.id).filter(Job.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    job_data = payload.model_dump()
    job_data["slug"] = slug
    job = Job(**job_data)
    db.add(job)
    db.commit()
    db.refresh(job)

    job_with_cat = db.query(Job).options(joinedload(Job.category)).filter(Job.id == job.id).first()
    return JobOut.model_validate(job_with_cat)


@router.put("/jobs/{job_id}", response_model=JobOut)
def update_job(
    job_id: int,
    payload: JobUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> JobOut:
    """Updates an existing job posting."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    update_dict = payload.model_dump(exclude_unset=True)
    if "slug" in update_dict and update_dict["slug"]:
        # Check slug uniqueness if changed
        if update_dict["slug"] != job.slug:
            existing = db.query(Job.id).filter(Job.slug == update_dict["slug"]).first()
            if existing:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Slug already in use.")

    for key, value in update_dict.items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    job_with_cat = db.query(Job).options(joinedload(Job.category)).filter(Job.id == job.id).first()
    return JobOut.model_validate(job_with_cat)


@router.delete("/jobs/{job_id}")
def delete_job(
    job_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    """Permanently deletes a job posting and cascades to applications."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    db.delete(job)
    db.commit()
    return {"status": "success", "message": f"Job #{job_id} successfully deleted."}


@router.patch("/jobs/{job_id}/toggle-status")
def toggle_job_status(
    job_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    """Toggles active/inactive visibility for a job."""
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found.")

    job.is_active = not job.is_active
    db.commit()
    return {"status": "success", "job_id": job.id, "is_active": job.is_active}


# --- Applicant Management ---------------------------------------------------
@router.get("/applicants", response_model=List[ApplicationOut])
def list_applicants(
    job_id: Optional[int] = Query(None),
    status_filter: Optional[str] = Query(None),
    q: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ApplicationOut]:
    """Lists all candidate applications with filters."""
    query = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.category))
    )

    if job_id:
        query = query.filter(Application.job_id == job_id)
    if status_filter and status_filter.strip():
        query = query.filter(Application.status == status_filter.strip().lower())
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Application.full_name.ilike(term),
                Application.email.ilike(term),
            )
        )

    query = query.order_by(Application.applied_at.desc())
    return [ApplicationOut.model_validate(a) for a in query.all()]


@router.get("/applicants/{applicant_id}", response_model=ApplicationOut)
def get_applicant_detail(
    applicant_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    """Retrieves full details of an application including candidate and resume info."""
    app_record = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.category))
        .filter(Application.id == applicant_id)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")
    return ApplicationOut.model_validate(app_record)


@router.patch("/applicants/{applicant_id}/status", response_model=ApplicationOut)
def update_application_status(
    applicant_id: int,
    payload: ApplicationStatusUpdate,
    background_tasks: BackgroundTasks,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    """Updates the status of an application and optionally sends notification email."""
    app_record = (
        db.query(Application)
        .options(joinedload(Application.job))
        .filter(Application.id == applicant_id)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    valid_statuses = {"pending", "reviewed", "shortlisted", "rejected", "accepted"}
    new_status = payload.status.lower().strip()
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{payload.status}'. Allowed: {', '.join(valid_statuses)}",
        )

    old_status = app_record.status
    app_record.status = new_status
    if payload.admin_notes is not None:
        app_record.admin_notes = payload.admin_notes

    db.commit()
    db.refresh(app_record)

    # If status changed, send candidate notification email in background
    if old_status != new_status and app_record.job:
        background_tasks.add_task(
            send_application_status_update_email,
            app_record.email,
            app_record.full_name,
            app_record.job.title,
            new_status,
            app_record.job.company_name,
        )

    return ApplicationOut.model_validate(app_record)


# --- User Management --------------------------------------------------------
@router.get("/users", response_model=List[UserOut])
def list_users(
    q: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[UserOut]:
    """Lists registered users."""
    query = db.query(User)
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(or_(User.email.ilike(term), User.full_name.ilike(term)))
    if role and role.strip():
        query = query.filter(User.role == role.strip())

    query = query.order_by(User.created_at.desc())
    return [UserOut.model_validate(u) for u in query.all()]


@router.patch("/users/{user_id}", response_model=UserOut)
def update_user_status(
    user_id: int,
    payload: AdminUserStatusUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> UserOut:
    """Updates a user's active status or role."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.role is not None:
        if payload.role not in {"customer", "admin"}:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role.")
        user.role = payload.role

    db.commit()
    db.refresh(user)
    return UserOut.model_validate(user)


# --- Category Management ----------------------------------------------------
@router.get("/categories", response_model=List[CategoryOut])
def list_admin_categories(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[CategoryOut]:
    """Lists all categories for administration."""
    categories = db.query(Category).order_by(Category.display_order.asc(), Category.name.asc()).all()
    return [CategoryOut.model_validate(c) for c in categories]


@router.post("/categories", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category(
    payload: CategoryCreate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CategoryOut:
    """Creates a new job category."""
    slug = payload.slug.strip() if payload.slug else _slugify(payload.name)
    existing = db.query(Category).filter(or_(Category.name == payload.name, Category.slug == slug)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category name or slug already exists.")

    cat_data = payload.model_dump()
    cat_data["slug"] = slug
    cat = Category(**cat_data)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return CategoryOut.model_validate(cat)


@router.put("/categories/{category_id}", response_model=CategoryOut)
def update_category(
    category_id: int,
    payload: CategoryUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CategoryOut:
    """Updates an existing category."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")

    update_dict = payload.model_dump(exclude_unset=True)
    for key, value in update_dict.items():
        setattr(cat, key, value)

    db.commit()
    db.refresh(cat)
    return CategoryOut.model_validate(cat)


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    """Deletes a job category."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")

    db.delete(cat)
    db.commit()
    return {"status": "success", "message": f"Category #{category_id} deleted."}


# --- Admin Settings & Dynamic Branding --------------------------------------
@router.get("/settings/branding", response_model=PlatformSettingOut)
def get_admin_branding_settings(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> PlatformSettingOut:
    """Returns editable platform settings and branding for administrators."""
    record = get_or_create_platform_settings(db)
    return PlatformSettingOut.model_validate(record)


@router.put("/settings/branding", response_model=PlatformSettingOut)
def update_admin_branding_settings(
    payload: PlatformSettingUpdate,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> PlatformSettingOut:
    """Updates dynamic platform branding (logo, colors, name, tagline, contacts)."""
    record = update_platform_settings(db, payload, admin_email=admin.email)
    return PlatformSettingOut.model_validate(record)


@router.get("/settings")
def get_admin_settings(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> dict:
    """Returns platform runtime configuration and dynamic branding without exposing secrets."""
    branding = get_or_create_platform_settings(db)
    return {
        "platform_name": branding.platform_name,
        "platform_logo_url": branding.platform_logo_url,
        "favicon_url": branding.favicon_url,
        "tagline": branding.tagline,
        "primary_color": branding.primary_color,
        "secondary_color": branding.secondary_color,
        "background_color": branding.background_color,
        "support_email": branding.support_email,
        "contact_phone": branding.contact_phone,
        "version": "2.0.0",
        "environment": settings.environment,
        "database_type": "Neon PostgreSQL" if "postgresql" in settings.database_url else "Relational Database",
        "smtp_status": "Configured (Active)" if settings.is_email_configured else "Not Configured (Simulated)",
        "smtp_sender": settings.effective_sender_email if settings.is_email_configured else "None",
        "max_upload_size_mb": settings.max_upload_size_mb,
        "token_lifetime_days": settings.access_token_expire_minutes // (60 * 24),
    }

