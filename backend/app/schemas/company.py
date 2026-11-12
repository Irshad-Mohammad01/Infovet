"""
Pydantic schemas for INFOVATE Software Development Company website and admin console.
"""

from datetime import date, datetime
from typing import Any, List, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, model_validator


# ---------------------------------------------------------------------------
# Company Profile
# ---------------------------------------------------------------------------
class CompanyProfileBase(BaseModel):
    company_name: str = Field(default="INFOVATE", max_length=120)
    tagline: str = Field(default="We Build Digital Solutions That Move Businesses Forward.", max_length=255)
    short_description: str = Field(...)
    about_markdown: str = Field(...)
    mission: str = Field(...)
    vision: str = Field(...)
    experience_years: int = Field(default=5, ge=0)
    projects_completed: int = Field(default=45, ge=0)
    satisfied_clients: int = Field(default=38, ge=0)
    primary_email: EmailStr = Field(...)
    phone: str = Field(..., max_length=50)
    address: str = Field(..., max_length=255)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None


class CompanyProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    short_description: Optional[str] = None
    about_markdown: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    experience_years: Optional[int] = None
    projects_completed: Optional[int] = None
    satisfied_clients: Optional[int] = None
    primary_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None


class CompanyProfileOut(CompanyProfileBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Services
# ---------------------------------------------------------------------------
class ServiceBase(BaseModel):
    title: str = Field(..., max_length=150)
    slug: Optional[str] = None
    icon: str = Field(default="Code", max_length=80)
    short_description: str = Field(...)
    full_description: str = Field(...)
    features: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    display_order: int = Field(default=0)
    is_active: bool = Field(default=True)


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    icon: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    features: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class ServiceOut(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Technologies
# ---------------------------------------------------------------------------
class TechnologyBase(BaseModel):
    name: str = Field(..., max_length=100)
    slug: Optional[str] = None
    category: str = Field(default="Backend", max_length=50)
    icon: str = Field(default="Code", max_length=100)
    description: str = Field(default="")
    is_featured: bool = Field(default=True)
    display_order: int = Field(default=0)


class TechnologyCreate(TechnologyBase):
    pass


class TechnologyUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


class TechnologyOut(TechnologyBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Project Images & Projects
# ---------------------------------------------------------------------------
class ProjectImageOut(BaseModel):
    id: int
    project_id: int
    image_url: str
    caption: Optional[str] = None
    display_order: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class ProjectImageCreate(BaseModel):
    image_url: str
    caption: Optional[str] = None
    display_order: int = 0


class ProjectBase(BaseModel):
    title: str = Field(..., max_length=200)
    slug: Optional[str] = None
    category: str = Field(default="Web Application", max_length=100)
    client_name: Optional[str] = None
    short_description: str = Field(...)
    full_description: str = Field(...)
    objectives: Optional[str] = None
    features: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    thumbnail_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    status: str = Field(default="Completed", max_length=50)
    is_featured: bool = Field(default=False)
    is_published: bool = Field(default=True)
    display_order: int = Field(default=0)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    category: Optional[str] = None
    client_name: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    objectives: Optional[str] = None
    features: Optional[List[str]] = None
    technologies: Optional[List[str]] = None
    thumbnail_url: Optional[str] = None
    live_url: Optional[str] = None
    github_url: Optional[str] = None
    start_date: Optional[date] = None
    completion_date: Optional[date] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None
    is_published: Optional[bool] = None
    display_order: Optional[int] = None


class ProjectOut(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    images: List[ProjectImageOut] = []
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Testimonials
# ---------------------------------------------------------------------------
class TestimonialBase(BaseModel):
    client_name: str = Field(..., max_length=150)
    client_company: str = Field(..., max_length=150)
    client_role: str = Field(default="Founder / CEO", max_length=100)
    client_avatar_url: Optional[str] = None
    rating: int = Field(default=5, ge=1, le=5)
    content: str = Field(...)
    project_title: Optional[str] = None
    is_featured: bool = Field(default=True)
    display_order: int = Field(default=0)


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    client_name: Optional[str] = None
    client_company: Optional[str] = None
    client_role: Optional[str] = None
    client_avatar_url: Optional[str] = None
    rating: Optional[int] = None
    content: Optional[str] = None
    project_title: Optional[str] = None
    is_featured: Optional[bool] = None
    display_order: Optional[int] = None


class TestimonialOut(TestimonialBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Team Members
# ---------------------------------------------------------------------------
class TeamMemberBase(BaseModel):
    name: str = Field(..., max_length=120)
    role: str = Field(..., max_length=120)
    bio: str = Field(default="")
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_active: bool = Field(default=True)
    display_order: int = Field(default=0)


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    twitter_url: Optional[str] = None
    is_active: Optional[bool] = None
    display_order: Optional[int] = None


class TeamMemberOut(TeamMemberBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Project Inquiry
# ---------------------------------------------------------------------------
class ProjectInquiryCreate(BaseModel):
    full_name: Optional[str] = None
    client_name: Optional[str] = None
    name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=50)
    company: Optional[str] = Field(default=None, max_length=150)
    company_name: Optional[str] = Field(default=None, max_length=150)
    inquiry_type: str = Field(default="project", max_length=50)
    project_type: Optional[str] = Field(default=None, max_length=100)
    estimated_budget: Optional[str] = Field(default=None, max_length=100)
    budget_range: Optional[str] = Field(default=None, max_length=100)
    timeline: Optional[str] = Field(default=None, max_length=100)
    expected_timeline: Optional[str] = Field(default=None, max_length=100)
    project_description: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = Field(default=None, max_length=255)
    message: Optional[str] = None
    attachment_url: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("full_name"):
                data["full_name"] = data.get("client_name") or data.get("name")
            if not data.get("company"):
                data["company"] = data.get("company_name")
            elif not data.get("company_name"):
                data["company_name"] = data.get("company")
            if not data.get("timeline"):
                data["timeline"] = data.get("expected_timeline")
            elif not data.get("expected_timeline"):
                data["expected_timeline"] = data.get("timeline")
            if not data.get("estimated_budget"):
                data["estimated_budget"] = data.get("budget_range")
            elif not data.get("budget_range"):
                data["budget_range"] = data.get("estimated_budget")
            if not data.get("project_description"):
                data["project_description"] = data.get("description") or data.get("message")
            if not data.get("message"):
                data["message"] = data.get("project_description") or data.get("description")
            inq_type = str(data.get("inquiry_type") or "project").lower()
            if inq_type == "general":
                if not data.get("project_type"):
                    data["project_type"] = "General Inquiry"
            else:
                if not data.get("project_type"):
                    data["project_type"] = "Custom Web Application"
        return data

    @model_validator(mode="after")
    def validate_content(self) -> "ProjectInquiryCreate":
        if not self.full_name or len(self.full_name.strip()) < 2:
            raise ValueError("Full name is required (minimum 2 characters).")
        has_content = bool(
            (self.project_description and self.project_description.strip())
            or (self.message and self.message.strip())
            or (self.subject and self.subject.strip())
        )
        if not has_content:
            raise ValueError("Please provide a project description or message.")
        return self


class ProjectInquiryUpdateAdmin(BaseModel):
    status: Optional[str] = Field(default=None, max_length=50)
    internal_notes: Optional[str] = None
    admin_notes: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def normalize_admin_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if not data.get("internal_notes") and data.get("admin_notes"):
                data["internal_notes"] = data.get("admin_notes")
        return data


class ProjectInquiryOut(BaseModel):
    id: int
    full_name: str
    client_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    company: Optional[str] = None
    company_name: Optional[str] = None
    inquiry_type: str = "project"
    project_type: Optional[str] = None
    estimated_budget: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    expected_timeline: Optional[str] = None
    project_description: Optional[str] = None
    description: Optional[str] = None
    subject: Optional[str] = None
    message: Optional[str] = None
    attachment_url: Optional[str] = None
    status: str = "NEW"
    internal_notes: Optional[str] = None
    admin_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="before")
    @classmethod
    def populate_aliases(cls, data: Any) -> Any:
        if hasattr(data, "full_name"):
            full_name = getattr(data, "full_name", None)
            comp = getattr(data, "company", None) or getattr(data, "company_name", None)
            budg = getattr(data, "estimated_budget", None)
            time_val = getattr(data, "timeline", None) or getattr(data, "expected_timeline", None)
            desc = getattr(data, "project_description", None) or getattr(data, "message", None)
            notes = getattr(data, "internal_notes", None)
            return {
                "id": getattr(data, "id"),
                "full_name": full_name,
                "client_name": full_name,
                "email": getattr(data, "email"),
                "phone": getattr(data, "phone", None),
                "company": comp,
                "company_name": comp,
                "inquiry_type": getattr(data, "inquiry_type", "project") or "project",
                "project_type": getattr(data, "project_type", None),
                "estimated_budget": budg,
                "budget_range": budg,
                "timeline": time_val,
                "expected_timeline": time_val,
                "project_description": desc,
                "description": desc,
                "subject": getattr(data, "subject", None),
                "message": getattr(data, "message", None) or desc,
                "attachment_url": getattr(data, "attachment_url", None),
                "status": getattr(data, "status", "NEW"),
                "internal_notes": notes,
                "admin_notes": notes,
                "created_at": getattr(data, "created_at"),
                "updated_at": getattr(data, "updated_at"),
            }
        return data


# ---------------------------------------------------------------------------
# Media Assets
# ---------------------------------------------------------------------------
class MediaAssetOut(BaseModel):
    id: int
    filename: str
    original_name: str
    file_url: str
    file_type: str
    file_size: int
    category: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


# ---------------------------------------------------------------------------
# Dashboard Stats
# ---------------------------------------------------------------------------
class CompanyDashboardStats(BaseModel):
    total_projects: int
    published_projects: int
    draft_projects: int
    total_services: int
    total_technologies: int
    total_testimonials: int
    total_team_members: int
    total_inquiries: int
    new_inquiries: int
    recent_inquiries: List[ProjectInquiryOut] = []
    recent_projects: List[ProjectOut] = []

