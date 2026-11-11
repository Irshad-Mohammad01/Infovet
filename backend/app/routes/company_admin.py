"""
Administrative API routes for INFOVET Software Development Company management console.
All routes require administrator authentication.
"""

import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session, joinedload

from app.core.security import get_current_admin
from app.database import get_db
from app.models.company import CompanyProfile
from app.models.media_asset import MediaAsset
from app.models.project import Project, ProjectImage
from app.models.project_inquiry import ProjectInquiry
from app.models.service import Service
from app.models.team_member import TeamMember
from app.models.technology import Technology
from app.models.testimonial import Testimonial
from app.models.user import User
from app.routes.company import get_or_create_company_profile
from app.schemas.company import (
    CompanyDashboardStats,
    CompanyProfileOut,
    CompanyProfileUpdate,
    MediaAssetOut,
    ProjectCreate,
    ProjectImageCreate,
    ProjectImageOut,
    ProjectInquiryOut,
    ProjectInquiryUpdateAdmin,
    ProjectOut,
    ProjectUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    TeamMemberCreate,
    TeamMemberOut,
    TeamMemberUpdate,
    TechnologyCreate,
    TechnologyOut,
    TechnologyUpdate,
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
)

router = APIRouter(prefix="/api/admin/company", tags=["admin-company"])


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    return s.strip("-")


# ---------------------------------------------------------------------------
# Dashboard Analytics
# ---------------------------------------------------------------------------
@router.get("/stats", response_model=CompanyDashboardStats)
def get_dashboard_stats(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CompanyDashboardStats:
    """Returns administrative KPIs and recent activity for the company console."""
    total_projects = db.query(Project).count()
    published_projects = db.query(Project).filter(Project.is_published.is_(True)).count()
    draft_projects = total_projects - published_projects
    total_services = db.query(Service).count()
    total_technologies = db.query(Technology).count()
    total_testimonials = db.query(Testimonial).count()
    total_team_members = db.query(TeamMember).count()
    total_inquiries = db.query(ProjectInquiry).count()
    new_inquiries = db.query(ProjectInquiry).filter(ProjectInquiry.status == "New").count()

    recent_inquiries = (
        db.query(ProjectInquiry)
        .order_by(ProjectInquiry.id.desc())
        .limit(6)
        .all()
    )

    recent_projects = (
        db.query(Project)
        .options(joinedload(Project.images))
        .order_by(Project.id.desc())
        .limit(5)
        .all()
    )

    return CompanyDashboardStats(
        total_projects=total_projects,
        published_projects=published_projects,
        draft_projects=draft_projects,
        total_services=total_services,
        total_technologies=total_technologies,
        total_testimonials=total_testimonials,
        total_team_members=total_team_members,
        total_inquiries=total_inquiries,
        new_inquiries=new_inquiries,
        recent_inquiries=recent_inquiries,
        recent_projects=recent_projects,
    )


# ---------------------------------------------------------------------------
# Company Profile
# ---------------------------------------------------------------------------
@router.get("/profile", response_model=CompanyProfileOut)
def get_admin_company_profile(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CompanyProfileOut:
    return get_or_create_company_profile(db)


@router.put("/profile", response_model=CompanyProfileOut)
def update_company_profile(
    payload: CompanyProfileUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> CompanyProfileOut:
    profile = get_or_create_company_profile(db)
    for field, val in payload.model_dump(exclude_unset=True).items():
        if val is not None:
            setattr(profile, field, val)
    db.commit()
    db.refresh(profile)
    return profile


# ---------------------------------------------------------------------------
# Services Management
# ---------------------------------------------------------------------------
@router.get("/services", response_model=List[ServiceOut])
def list_admin_services(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ServiceOut]:
    return db.query(Service).order_by(Service.display_order.asc(), Service.id.asc()).all()


@router.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
    payload: ServiceCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceOut:
    slug = slugify(payload.slug or payload.title)
    # Ensure unique slug
    base_slug = slug
    counter = 1
    while db.query(Service).filter(Service.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    service = Service(
        title=payload.title.strip(),
        slug=slug,
        icon=payload.icon.strip() or "Code",
        short_description=payload.short_description.strip(),
        full_description=payload.full_description.strip(),
        features=payload.features,
        technologies=payload.technologies,
        display_order=payload.display_order,
        is_active=payload.is_active,
    )
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get("/services/{service_id}", response_model=ServiceOut)
def get_service_by_id(
    service_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceOut:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    return service


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int,
    payload: ServiceUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ServiceOut:
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "slug" and val:
            val = slugify(val)
        setattr(service, field, val)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    db.delete(service)
    db.commit()


# ---------------------------------------------------------------------------
# Projects / Portfolio Management
# ---------------------------------------------------------------------------
@router.get("/projects", response_model=List[ProjectOut])
def list_admin_projects(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ProjectOut]:
    return (
        db.query(Project)
        .options(joinedload(Project.images))
        .order_by(Project.display_order.asc(), Project.id.desc())
        .all()
    )


@router.post("/projects", response_model=ProjectOut, status_code=status.HTTP_201_CREATED)
def create_project(
    payload: ProjectCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectOut:
    slug = slugify(payload.slug or payload.title)
    base_slug = slug
    counter = 1
    while db.query(Project).filter(Project.slug == slug).first():
        slug = f"{base_slug}-{counter}"
        counter += 1

    project = Project(
        title=payload.title.strip(),
        slug=slug,
        category=payload.category.strip(),
        client_name=payload.client_name.strip() if payload.client_name else None,
        short_description=payload.short_description.strip(),
        full_description=payload.full_description.strip(),
        objectives=payload.objectives.strip() if payload.objectives else None,
        features=payload.features,
        technologies=payload.technologies,
        thumbnail_url=payload.thumbnail_url,
        live_url=payload.live_url.strip() if payload.live_url else None,
        github_url=payload.github_url.strip() if payload.github_url else None,
        start_date=payload.start_date,
        completion_date=payload.completion_date,
        status=payload.status,
        is_featured=payload.is_featured,
        is_published=payload.is_published,
        display_order=payload.display_order,
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/projects/{project_id}", response_model=ProjectOut)
def get_project_by_id(
    project_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectOut:
    project = (
        db.query(Project)
        .options(joinedload(Project.images))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    return project


@router.put("/projects/{project_id}", response_model=ProjectOut)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectOut:
    project = (
        db.query(Project)
        .options(joinedload(Project.images))
        .filter(Project.id == project_id)
        .first()
    )
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "slug" and val:
            val = slugify(val)
        setattr(project, field, val)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(
    project_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")
    db.delete(project)
    db.commit()


@router.post("/projects/{project_id}/images", response_model=ProjectImageOut, status_code=status.HTTP_201_CREATED)
def add_project_image(
    project_id: int,
    payload: ProjectImageCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectImageOut:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found.")

    image = ProjectImage(
        project_id=project_id,
        image_url=payload.image_url,
        caption=payload.caption,
        display_order=payload.display_order,
    )
    db.add(image)
    db.commit()
    db.refresh(image)
    return image


@router.delete("/projects/images/{image_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_image(
    image_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    img = db.query(ProjectImage).filter(ProjectImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found.")
    db.delete(img)
    db.commit()


# ---------------------------------------------------------------------------
# Technologies Management
# ---------------------------------------------------------------------------
@router.get("/technologies", response_model=List[TechnologyOut])
def list_admin_technologies(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[TechnologyOut]:
    return db.query(Technology).order_by(Technology.category.asc(), Technology.display_order.asc()).all()


@router.post("/technologies", response_model=TechnologyOut, status_code=status.HTTP_201_CREATED)
def create_technology(
    payload: TechnologyCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TechnologyOut:
    slug = slugify(payload.slug or payload.name)
    tech = Technology(
        name=payload.name.strip(),
        slug=slug,
        category=payload.category.strip(),
        icon=payload.icon.strip() or "Code",
        description=payload.description.strip(),
        is_featured=payload.is_featured,
        display_order=payload.display_order,
    )
    db.add(tech)
    db.commit()
    db.refresh(tech)
    return tech


@router.put("/technologies/{tech_id}", response_model=TechnologyOut)
def update_technology(
    tech_id: int,
    payload: TechnologyUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TechnologyOut:
    tech = db.query(Technology).filter(Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technology not found.")
    for field, val in payload.model_dump(exclude_unset=True).items():
        if field == "slug" and val:
            val = slugify(val)
        setattr(tech, field, val)
    db.commit()
    db.refresh(tech)
    return tech


@router.delete("/technologies/{tech_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_technology(
    tech_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    tech = db.query(Technology).filter(Technology.id == tech_id).first()
    if not tech:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Technology not found.")
    db.delete(tech)
    db.commit()


# ---------------------------------------------------------------------------
# Testimonials Management
# ---------------------------------------------------------------------------
@router.get("/testimonials", response_model=List[TestimonialOut])
def list_admin_testimonials(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[TestimonialOut]:
    return db.query(Testimonial).order_by(Testimonial.display_order.asc(), Testimonial.id.desc()).all()


@router.post("/testimonials", response_model=TestimonialOut, status_code=status.HTTP_201_CREATED)
def create_testimonial(
    payload: TestimonialCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TestimonialOut:
    item = Testimonial(
        client_name=payload.client_name.strip(),
        client_company=payload.client_company.strip(),
        client_role=payload.client_role.strip(),
        client_avatar_url=payload.client_avatar_url,
        rating=payload.rating,
        content=payload.content.strip(),
        project_title=payload.project_title.strip() if payload.project_title else None,
        is_featured=payload.is_featured,
        display_order=payload.display_order,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/testimonials/{item_id}", response_model=TestimonialOut)
def update_testimonial(
    item_id: int,
    payload: TestimonialUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TestimonialOut:
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, val)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/testimonials/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_testimonial(
    item_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    item = db.query(Testimonial).filter(Testimonial.id == item_id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Testimonial not found.")
    db.delete(item)
    db.commit()


# ---------------------------------------------------------------------------
# Team Members Management
# ---------------------------------------------------------------------------
@router.get("/team", response_model=List[TeamMemberOut])
def list_admin_team(
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[TeamMemberOut]:
    return db.query(TeamMember).order_by(TeamMember.display_order.asc(), TeamMember.id.asc()).all()


@router.post("/team", response_model=TeamMemberOut, status_code=status.HTTP_201_CREATED)
def create_team_member(
    payload: TeamMemberCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TeamMemberOut:
    member = TeamMember(
        name=payload.name.strip(),
        role=payload.role.strip(),
        bio=payload.bio.strip(),
        photo_url=payload.photo_url,
        linkedin_url=payload.linkedin_url,
        github_url=payload.github_url,
        twitter_url=payload.twitter_url,
        is_active=payload.is_active,
        display_order=payload.display_order,
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.put("/team/{member_id}", response_model=TeamMemberOut)
def update_team_member(
    member_id: int,
    payload: TeamMemberUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> TeamMemberOut:
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found.")
    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(member, field, val)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/team/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team_member(
    member_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    member = db.query(TeamMember).filter(TeamMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Team member not found.")
    db.delete(member)
    db.commit()


# ---------------------------------------------------------------------------
# Inquiries Management
# ---------------------------------------------------------------------------
@router.get("/inquiries", response_model=List[ProjectInquiryOut])
def list_admin_inquiries(
    status_filter: Optional[str] = Query(None, alias="status"),
    search: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[ProjectInquiryOut]:
    query = db.query(ProjectInquiry)
    if status_filter and status_filter.lower() != "all":
        query = query.filter(ProjectInquiry.status.ilike(status_filter.strip()))
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ProjectInquiry.full_name.ilike(s),
                ProjectInquiry.email.ilike(s),
                ProjectInquiry.company_name.ilike(s),
                ProjectInquiry.project_type.ilike(s),
            )
        )
    return query.order_by(ProjectInquiry.id.desc()).all()


@router.get("/inquiries/{inquiry_id}", response_model=ProjectInquiryOut)
def get_inquiry_by_id(
    inquiry_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    inquiry = db.query(ProjectInquiry).filter(ProjectInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")
    return inquiry


@router.patch("/inquiries/{inquiry_id}", response_model=ProjectInquiryOut)
def update_inquiry_status(
    inquiry_id: int,
    payload: ProjectInquiryUpdateAdmin,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> ProjectInquiryOut:
    inquiry = db.query(ProjectInquiry).filter(ProjectInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")
    if payload.status is not None:
        inquiry.status = payload.status
    if payload.internal_notes is not None:
        inquiry.internal_notes = payload.internal_notes
    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.delete("/inquiries/{inquiry_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_inquiry(
    inquiry_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    inquiry = db.query(ProjectInquiry).filter(ProjectInquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Inquiry not found.")
    db.delete(inquiry)
    db.commit()


# ---------------------------------------------------------------------------
# Media Assets
# ---------------------------------------------------------------------------
@router.get("/media", response_model=List[MediaAssetOut])
def list_admin_media(
    category: Optional[str] = Query(None),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> List[MediaAssetOut]:
    query = db.query(MediaAsset)
    if category and category.lower() != "all":
        query = query.filter(MediaAsset.category == category)
    return query.order_by(MediaAsset.id.desc()).all()


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_media_asset(
    media_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    media = db.query(MediaAsset).filter(MediaAsset.id == media_id).first()
    if not media:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media asset not found.")
    db.delete(media)
    db.commit()

