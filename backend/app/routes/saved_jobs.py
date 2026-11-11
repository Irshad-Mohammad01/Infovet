"""
Saved jobs / candidate bookmarking endpoints for Infovet.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_active_user
from app.database import get_db
from app.models.job import Job
from app.models.saved_job import SavedJob
from app.models.user import User
from app.schemas.job import JobOut

router = APIRouter(prefix="/api/saved-jobs", tags=["saved-jobs"])


@router.post("/{job_id}")
def toggle_save_job(
    job_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    """Toggles bookmark for a job: saves if not bookmarked, removes if already bookmarked."""
    job = db.query(Job).filter(Job.id == job_id, Job.is_active.is_(True)).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job listing not found or inactive.",
        )

    saved_record = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id,
    ).first()

    if saved_record:
        db.delete(saved_record)
        db.commit()
        return {"job_id": job_id, "saved": False, "message": "Job removed from saved list."}
    else:
        new_save = SavedJob(user_id=current_user.id, job_id=job_id)
        db.add(new_save)
        db.commit()
        return {"job_id": job_id, "saved": True, "message": "Job successfully saved."}


@router.get("", response_model=List[JobOut])
def get_saved_jobs(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> List[JobOut]:
    """Retrieves all jobs bookmarked by the current user."""
    saved_records = (
        db.query(SavedJob)
        .options(joinedload(SavedJob.job).joinedload(Job.category))
        .filter(SavedJob.user_id == current_user.id)
        .order_by(SavedJob.created_at.desc())
        .all()
    )

    out = []
    for record in saved_records:
        if record.job and record.job.is_active:
            item = JobOut.model_validate(record.job)
            item.is_saved = True
            out.append(item)
    return out


@router.delete("/{job_id}")
def remove_saved_job(
    job_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
) -> dict:
    """Removes a job from the user's saved list."""
    saved_record = db.query(SavedJob).filter(
        SavedJob.user_id == current_user.id,
        SavedJob.job_id == job_id,
    ).first()

    if saved_record:
        db.delete(saved_record)
        db.commit()

    return {"job_id": job_id, "saved": False, "message": "Job removed from saved list."}

