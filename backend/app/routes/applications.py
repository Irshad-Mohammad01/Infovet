"""
Job application submission and tracking endpoints for candidates.
"""

import logging
from typing import List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_active_user
from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationOut
from app.services.email import send_application_confirmation_email

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=status.HTTP_201_CREATED)
def submit_application(
    payload: ApplicationCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    """Submits a job application for the authenticated user."""
    job = db.query(Job).filter(Job.id == payload.job_id, Job.is_active.is_(True)).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The job listing you are applying for is either closed or no longer exists.",
        )

    # Check for duplicate submission
    existing = db.query(Application).filter(
        Application.job_id == job.id,
        Application.user_id == current_user.id,
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted an application for this position.",
        )

    application = Application(
        job_id=job.id,
        user_id=current_user.id,
        full_name=payload.full_name.strip(),
        email=payload.email.lower().strip(),
        phone=payload.phone.strip() if payload.phone else None,
        resume_url=payload.resume_url.strip(),
        cover_note=payload.cover_note.strip() if payload.cover_note else None,
        portfolio_url=payload.portfolio_url.strip() if payload.portfolio_url else None,
        linkedin_url=payload.linkedin_url.strip() if payload.linkedin_url else None,
        status="pending",
    )
    db.add(application)
    db.commit()
    db.refresh(application)

    # Dispatch email confirmation in background
    background_tasks.add_task(
        send_application_confirmation_email,
        application.email,
        application.full_name,
        job.title,
        job.company_name,
    )

    # Re-fetch with joined job
    app_with_job = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.category))
        .filter(Application.id == application.id)
        .first()
    )

    return ApplicationOut.model_validate(app_with_job)


@router.get("/my", response_model=List[ApplicationOut])
def get_my_applications(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> List[ApplicationOut]:
    """Retrieves all applications submitted by the current user."""
    apps = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.category))
        .filter(Application.user_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )
    return [ApplicationOut.model_validate(a) for a in apps]


@router.get("/{application_id}", response_model=ApplicationOut)
def get_application_detail(
    application_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> ApplicationOut:
    """Retrieves details of a submitted application (accessible by owner or admin)."""
    app_record = (
        db.query(Application)
        .options(joinedload(Application.job).joinedload(Job.category))
        .filter(Application.id == application_id)
        .first()
    )
    if not app_record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found.")

    if app_record.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this application.",
        )

    return ApplicationOut.model_validate(app_record)

