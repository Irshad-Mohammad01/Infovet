"""
Job browsing, search, and category exploration endpoints for Infovate.
"""

import math
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_optional_current_user
from app.database import get_db
from app.models.application import Application
from app.models.category import Category
from app.models.job import Job
from app.models.saved_job import SavedJob
from app.models.user import User
from app.schemas.category import CategoryOut
from app.schemas.job import JobListResponse, JobOut

router = APIRouter(prefix="/api/jobs", tags=["jobs"])


@router.get("/categories", response_model=List[CategoryOut])
def get_job_categories(db: Session = Depends(get_db)) -> List[CategoryOut]:
    """Retrieves all active job categories with the count of active listings."""
    # Subquery for active jobs count per category
    jobs_count_sub = (
        db.query(Job.category_id, func.count(Job.id).label("cnt"))
        .filter(Job.is_active.is_(True))
        .group_by(Job.category_id)
        .subquery()
    )

    results = (
        db.query(Category, func.coalesce(jobs_count_sub.c.cnt, 0))
        .outerjoin(jobs_count_sub, Category.id == jobs_count_sub.c.category_id)
        .filter(Category.is_active.is_(True))
        .order_by(Category.display_order.asc(), Category.name.asc())
        .all()
    )

    out = []
    for cat, count in results:
        data = CategoryOut.model_validate(cat)
        data.jobs_count = count
        out.append(data)
    return out


@router.get("", response_model=JobListResponse)
def search_jobs(
    q: Optional[str] = Query(None, description="Search keyword in title, company, or tags"),
    location: Optional[str] = Query(None, description="City, state, or 'Remote'"),
    category: Optional[str] = Query(None, description="Category slug or name"),
    category_id: Optional[int] = Query(None, description="Category ID"),
    workplace_type: Optional[str] = Query(None, description="Remote, On-site, Hybrid"),
    job_type: Optional[str] = Query(None, description="Full-time, Part-time, Contract, Internship"),
    experience_level: Optional[str] = Query(None, description="Entry Level, Mid Level, Senior Level, Director / Lead"),
    salary_min: Optional[int] = Query(None, description="Minimum salary"),
    is_featured: Optional[bool] = Query(None, description="Filter featured jobs only"),
    sort: Optional[str] = Query("newest", description="newest, salary_high, salary_low"),
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=50),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> JobListResponse:
    """Discovers and filters active job listings with pagination."""
    query = (
        db.query(Job)
        .options(joinedload(Job.category))
        .filter(Job.is_active.is_(True))
    )

    # Keyword filter
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Job.title.ilike(term),
                Job.company_name.ilike(term),
                Job.tags.ilike(term),
                Job.description.ilike(term),
            )
        )

    # Location filter
    if location and location.strip():
        query = query.filter(Job.location.ilike(f"%{location.strip()}%"))

    # Category filters
    if category_id:
        query = query.filter(Job.category_id == category_id)
    elif category and category.strip():
        cat_match = db.query(Category.id).filter(
            or_(Category.slug == category.strip(), Category.name.ilike(category.strip()))
        ).first()
        if cat_match:
            query = query.filter(Job.category_id == cat_match[0])

    # Enum filters
    if workplace_type and workplace_type.strip():
        query = query.filter(Job.workplace_type.ilike(workplace_type.strip()))
    if job_type and job_type.strip():
        query = query.filter(Job.job_type.ilike(job_type.strip()))
    if experience_level and experience_level.strip():
        query = query.filter(Job.experience_level.ilike(experience_level.strip()))
    if salary_min is not None:
        query = query.filter(Job.salary_max >= salary_min)
    if is_featured is not None:
        query = query.filter(Job.is_featured == is_featured)

    # Sorting
    if sort == "salary_high":
        query = query.order_by(Job.salary_max.desc().nullslast(), Job.created_at.desc())
    elif sort == "salary_low":
        query = query.order_by(Job.salary_min.asc().nullslast(), Job.created_at.desc())
    else:
        # Default: newest, featured on top
        query = query.order_by(Job.is_featured.desc(), Job.created_at.desc())

    total = query.count()
    total_pages = math.ceil(total / size) if total > 0 else 1

    jobs = query.offset((page - 1) * size).limit(size).all()

    # Pre-fetch saved and applied status if user is authenticated
    saved_job_ids = set()
    applied_job_ids = set()
    if current_user:
        job_ids = [j.id for j in jobs]
        if job_ids:
            saved_rows = db.query(SavedJob.job_id).filter(
                SavedJob.user_id == current_user.id,
                SavedJob.job_id.in_(job_ids),
            ).all()
            saved_job_ids = {r[0] for r in saved_rows}

            applied_rows = db.query(Application.job_id).filter(
                Application.user_id == current_user.id,
                Application.job_id.in_(job_ids),
            ).all()
            applied_job_ids = {r[0] for r in applied_rows}

    items = []
    for job in jobs:
        item = JobOut.model_validate(job)
        item.is_saved = job.id in saved_job_ids
        item.has_applied = job.id in applied_job_ids
        items.append(item)

    return JobListResponse(
        items=items,
        total=total,
        page=page,
        size=size,
        pages=total_pages,
    )


@router.get("/featured", response_model=List[JobOut])
def get_featured_jobs(
    limit: int = Query(6, ge=1, le=20),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> List[JobOut]:
    """Retrieves top featured jobs for landing page showcase."""
    jobs = (
        db.query(Job)
        .options(joinedload(Job.category))
        .filter(Job.is_active.is_(True), Job.is_featured.is_(True))
        .order_by(Job.created_at.desc())
        .limit(limit)
        .all()
    )

    # Fallback to newest jobs if fewer featured jobs exist
    if len(jobs) < limit:
        existing_ids = {j.id for j in jobs}
        extra = (
            db.query(Job)
            .options(joinedload(Job.category))
            .filter(Job.is_active.is_(True), Job.id.notin_(existing_ids))
            .order_by(Job.created_at.desc())
            .limit(limit - len(jobs))
            .all()
        )
        jobs.extend(extra)

    saved_job_ids = set()
    applied_job_ids = set()
    if current_user and jobs:
        job_ids = [j.id for j in jobs]
        saved_rows = db.query(SavedJob.job_id).filter(
            SavedJob.user_id == current_user.id,
            SavedJob.job_id.in_(job_ids),
        ).all()
        saved_job_ids = {r[0] for r in saved_rows}

        applied_rows = db.query(Application.job_id).filter(
            Application.user_id == current_user.id,
            Application.job_id.in_(job_ids),
        ).all()
        applied_job_ids = {r[0] for r in applied_rows}

    out = []
    for job in jobs:
        item = JobOut.model_validate(job)
        item.is_saved = job.id in saved_job_ids
        item.has_applied = job.id in applied_job_ids
        out.append(item)
    return out


@router.get("/{id_or_slug}", response_model=JobOut)
def get_job_detail(
    id_or_slug: str,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
) -> JobOut:
    """Retrieves full details of a single job listing and increments its view count."""
    job = None
    if id_or_slug.isdigit():
        job = (
            db.query(Job)
            .options(joinedload(Job.category))
            .filter(Job.id == int(id_or_slug))
            .first()
        )

    if not job:
        job = (
            db.query(Job)
            .options(joinedload(Job.category))
            .filter(Job.slug == id_or_slug)
            .first()
        )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested job listing could not be found.",
        )

    # Increment view counter atomically
    job.views_count += 1
    db.commit()

    item = JobOut.model_validate(job)
    if current_user:
        item.is_saved = bool(
            db.query(SavedJob.id).filter(
                SavedJob.user_id == current_user.id,
                SavedJob.job_id == job.id,
            ).first()
        )
        item.has_applied = bool(
            db.query(Application.id).filter(
                Application.user_id == current_user.id,
                Application.job_id == job.id,
            ).first()
        )

    return item

