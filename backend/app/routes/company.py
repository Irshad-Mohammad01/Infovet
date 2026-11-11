"""
Public API routes for INFOVET Software Development Company website.
Provides dynamic database content for services, projects, technologies, team, testimonials, and inquiries.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.database import get_db
from app.models.company import CompanyProfile
from app.models.media_asset import MediaAsset
from app.models.project import Project, ProjectImage
from app.models.project_inquiry import ProjectInquiry
from app.models.service import Service
from app.models.team_member import TeamMember
from app.models.technology import Technology
from app.models.testimonial import Testimonial
from app.schemas.company import (
    CompanyProfileOut,
    ProjectInquiryCreate,
    ProjectInquiryOut,
    ProjectOut,
    ServiceOut,
    TeamMemberOut,
    TechnologyOut,
    TestimonialOut,
)

router = APIRouter(prefix="/api/company", tags=["company"])


def get_or_create_company_profile(db: Session) -> CompanyProfile:
    profile = db.query(CompanyProfile).first()
    if not profile:
        profile = CompanyProfile(
            company_name="INFOVET",
            tagline="We Build Digital Solutions That Move Businesses Forward.",
            short_description="INFOVET is a modern software engineering partner crafting cutting-edge web, mobile, and enterprise digital solutions.",
            about_markdown=(
                "INFOVET is an agile software development startup and digital engineering company. "
                "We architect, develop, and scale mission-critical digital products for startups and enterprises worldwide. "
                "Our team combines deep technical expertise in React, FastAPI, Python, cloud architectures, and user-centric design "
                "to deliver robust, elegant, and market-ready software solutions."
            ),
            mission="To deliver dependable, scalable, and beautifully crafted software products that accelerate business growth.",
            vision="To be the premier digital engineering partner known for craftsmanship, transparency, and client success.",
            experience_years=5,
            projects_completed=45,
            satisfied_clients=38,
            primary_email="contact@infovet.in",
            phone="+91 98765 43210",
            address="Bengaluru, Karnataka, India",
            linkedin_url="https://linkedin.com/company/infovet",
            github_url="https://github.com/infovet",
            twitter_url="https://twitter.com/infovet",
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


# ---------------------------------------------------------------------------
# Company Profile
# ---------------------------------------------------------------------------
@router.get("/profile", response_model=CompanyProfileOut)
def get_company_profile(db: Session = Depends(get_db)) -> CompanyProfileOut:
    """Returns public company overview, mission, stats, and coordinates."""
    return get_or_create_company_profile(db)


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
@router.get("/services", response_model=List[ServiceOut])
def get_services(db: Session = Depends(get_db)) -> List[ServiceOut]:
    """Returns active published services sorted by display order."""
    return (
        db.query(Service)
        .filter(Service.is_active.is_(True))
        .order_by(Service.display_order.asc(), Service.id.asc())
        .all()
    )


@router.get("/services/{slug_or_id}", response_model=ServiceOut)
def get_service_detail(slug_or_id: str, db: Session = Depends(get_db)) -> ServiceOut:
    """Returns a single service detail by slug or ID."""
    query = db.query(Service).filter(Service.is_active.is_(True))
    if slug_or_id.isdigit():
        service = query.filter(or_(Service.id == int(slug_or_id), Service.slug == slug_or_id)).first()
    else:
        service = query.filter(Service.slug == slug_or_id).first()

    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    return service


# ---------------------------------------------------------------------------
# Projects / Portfolio
# ---------------------------------------------------------------------------
@router.get("/projects", response_model=List[ProjectOut])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by project category"),
    featured: Optional[bool] = Query(None, description="Filter featured projects only"),
    limit: Optional[int] = Query(None, ge=1, le=100),
    db: Session = Depends(get_db),
) -> List[ProjectOut]:
    """Returns published portfolio projects with screenshots."""
    query = (
        db.query(Project)
        .options(joinedload(Project.images))
        .filter(Project.is_published.is_(True))
    )

    if category and category.lower() != "all":
        query = query.filter(Project.category.ilike(f"%{category.strip()}%"))

    if featured is not None:
        query = query.filter(Project.is_featured.is_(featured))

    query = query.order_by(Project.display_order.asc(), Project.id.desc())

    if limit:
        query = query.limit(limit)

    return query.all()


@router.get("/projects/{slug_or_id}", response_model=ProjectOut)
def get_project_detail(slug_or_id: str, db: Session = Depends(get_db)) -> ProjectOut:
    """Returns full project details and screenshot gallery."""
    query = (
        db.query(Project)
        .options(joinedload(Project.images))
        .filter(Project.is_published.is_(True))
    )

    if slug_or_id.isdigit():
        project = query.filter(or_(Project.id == int(slug_or_id), Project.slug == slug_or_id)).first()
    else:
        project = query.filter(Project.slug == slug_or_id).first()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return project


# ---------------------------------------------------------------------------
# Technologies
# ---------------------------------------------------------------------------
@router.get("/technologies", response_model=List[TechnologyOut])
def get_technologies(
    category: Optional[str] = Query(None, description="Filter by tech category"),
    featured: Optional[bool] = Query(None, description="Filter featured only"),
    db: Session = Depends(get_db),
) -> List[TechnologyOut]:
    """Returns technology stacks used by INFOVET."""
    query = db.query(Technology)
    if category and category.lower() != "all":
        query = query.filter(Technology.category.ilike(f"%{category.strip()}%"))
    if featured is not None:
        query = query.filter(Technology.is_featured.is_(featured))
    return query.order_by(Technology.display_order.asc(), Technology.id.asc()).all()


# ---------------------------------------------------------------------------
# Testimonials & Team
# ---------------------------------------------------------------------------
@router.get("/testimonials", response_model=List[TestimonialOut])
def get_testimonials(db: Session = Depends(get_db)) -> List[TestimonialOut]:
    """Returns client reviews and testimonials."""
    return (
        db.query(Testimonial)
        .filter(Testimonial.is_featured.is_(True))
        .order_by(Testimonial.display_order.asc(), Testimonial.id.asc())
        .all()
    )


@router.get("/team", response_model=List[TeamMemberOut])
def get_team_members(db: Session = Depends(get_db)) -> List[TeamMemberOut]:
    """Returns active company team members."""
    return (
        db.query(TeamMember)
        .filter(TeamMember.is_active.is_(True))
        .order_by(TeamMember.display_order.asc(), TeamMember.id.asc())
        .all()
    )


# ---------------------------------------------------------------------------
# Inquiries
# ---------------------------------------------------------------------------
@router.post("/inquiries", response_model=ProjectInquiryOut, status_code=status.HTTP_201_CREATED)
def submit_project_inquiry(
    payload: ProjectInquiryCreate,
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    """Submits a project inquiry from a prospective client."""
    full_name = (payload.full_name or payload.client_name or payload.name or "").strip()
    company = (payload.company_name or payload.company or "").strip() or None
    est_budget = (payload.estimated_budget or payload.budget_range or "").strip() or None
    exp_timeline = (payload.expected_timeline or payload.timeline or "").strip() or None
    raw_desc = (payload.project_description or payload.description or payload.message or "").strip()
    subject = (payload.subject or "").strip()
    if subject and not raw_desc.startswith(f"Subject: {subject}"):
        proj_desc = f"Subject: {subject}\n\n{raw_desc}"
    else:
        proj_desc = raw_desc

    if payload.project_type and payload.project_type.strip():
        proj_type = payload.project_type.strip()
    elif subject:
        proj_type = f"Inquiry: {subject}"
    else:
        proj_type = "General Inquiry"

    inquiry = ProjectInquiry(
        full_name=full_name,
        email=payload.email.lower().strip(),
        phone=payload.phone.strip() if payload.phone else None,
        company_name=company,
        project_type=proj_type,
        estimated_budget=est_budget,
        expected_timeline=exp_timeline,
        project_description=proj_desc,
        attachment_url=payload.attachment_url,
        status="New",
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

