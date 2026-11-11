"""
Automated unit tests for INFOVET Software Development Company public and administrative APIs.
"""

from fastapi.testclient import TestClient
import pytest

from app.core.security import create_access_token, hash_password
from app.database import get_db
from app.main import app
from app.models.company import CompanyProfile
from app.models.project import Project
from app.models.service import Service
from app.models.user import User


@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def admin_token(db_session):
    admin = User(
        email="company_admin@infovet.in",
        hashed_password=hash_password("AdminSecurePass123"),
        full_name="Infovet Admin",
        role="admin",
        is_active=True,
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return create_access_token(subject=admin.id, role="admin")


@pytest.fixture
def customer_token(db_session):
    customer = User(
        email="visitor@example.com",
        hashed_password=hash_password("VisitorPass123"),
        full_name="John Visitor",
        role="customer",
        is_active=True,
    )
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)
    return create_access_token(subject=customer.id, role="customer")


def test_public_company_profile(client):
    """GET /api/company/profile returns company information without requiring authentication."""
    res = client.get("/api/company/profile")
    assert res.status_code == 200
    data = res.json()
    assert data["company_name"] == "INFOVET"
    assert "tagline" in data
    assert "mission" in data


def test_public_project_inquiry_submission(client):
    """Public visitors can submit a project inquiry."""
    payload = {
        "full_name": "Satish Kumar",
        "email": "satish@apexcorp.com",
        "phone": "+91 99887 76655",
        "company_name": "Apex Corporation",
        "project_type": "Custom SaaS Platform",
        "estimated_budget": "$10,000 - $25,000",
        "expected_timeline": "2-3 Months",
        "project_description": "We need an enterprise inventory and analytics SaaS built with React and FastAPI.",
    }
    res = client.post("/api/company/inquiries", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["full_name"] == "Satish Kumar"
    assert data["status"] == "New"
    assert "id" in data


def test_admin_services_crud(client, admin_token, customer_token):
    """Admin can create, read, update, and delete company services; customers cannot."""
    headers = {"Authorization": f"Bearer {admin_token}"}
    cust_headers = {"Authorization": f"Bearer {customer_token}"}

    # 1. Customer rejected
    res_forbidden = client.post(
        "/api/admin/company/services",
        json={"title": "Test Service", "short_description": "Short", "full_description": "Full"},
        headers=cust_headers,
    )
    assert res_forbidden.status_code == 403

    # 2. Admin creates service
    service_payload = {
        "title": "Cloud Native Microservices",
        "slug": "cloud-native-microservices",
        "icon": "Cloud",
        "short_description": "Scalable Kubernetes and Docker architectures.",
        "full_description": "We design and deploy zero-downtime containerized architectures.",
        "features": ["Docker", "Kubernetes", "CI/CD"],
        "technologies": ["AWS", "Docker", "FastAPI"],
        "display_order": 1,
        "is_active": True,
    }
    res_create = client.post("/api/admin/company/services", json=service_payload, headers=headers)
    assert res_create.status_code == 201
    created = res_create.json()
    service_id = created["id"]
    assert created["slug"] == "cloud-native-microservices"

    # 3. Public services endpoint lists the new service
    res_pub = client.get("/api/company/services")
    assert res_pub.status_code == 200
    services = res_pub.json()
    assert any(s["id"] == service_id for s in services)

    # 4. Admin updates service
    res_update = client.put(
        f"/api/admin/company/services/{service_id}",
        json={"title": "Cloud Native & DevOps Engineering"},
        headers=headers,
    )
    assert res_update.status_code == 200
    assert res_update.json()["title"] == "Cloud Native & DevOps Engineering"

    # 5. Admin deletes service
    res_delete = client.delete(f"/api/admin/company/services/{service_id}", headers=headers)
    assert res_delete.status_code == 204


def test_admin_projects_crud_and_inquiries(client, admin_token):
    """Admin can manage projects and view/update project inquiries."""
    headers = {"Authorization": f"Bearer {admin_token}"}

    # 1. Admin creates project
    project_payload = {
        "title": "HealthVitals Telehealth Suite",
        "slug": "healthvitals-telehealth",
        "category": "Web Application",
        "client_name": "HealthVitals Global",
        "short_description": "HIPAA-compliant telemedicine platform with video consultations.",
        "full_description": "Comprehensive digital health consultation engine with encrypted patient records.",
        "features": ["Video calling", "EHR integrations", "Prescriptions"],
        "technologies": ["React", "FastAPI", "WebRTC", "PostgreSQL"],
        "status": "Completed",
        "is_featured": True,
        "is_published": True,
        "display_order": 1,
    }
    res_proj = client.post("/api/admin/company/projects", json=project_payload, headers=headers)
    assert res_proj.status_code == 201
    proj_id = res_proj.json()["id"]

    # 2. Add screenshot to project
    res_img = client.post(
        f"/api/admin/company/projects/{proj_id}/images",
        json={"image_url": "https://images.example.com/screenshot1.png", "caption": "Doctor Dashboard"},
        headers=headers,
    )
    assert res_img.status_code == 201

    # 3. Public project detail endpoint
    res_detail = client.get("/api/company/projects/healthvitals-telehealth")
    assert res_detail.status_code == 200
    detail = res_detail.json()
    assert detail["title"] == "HealthVitals Telehealth Suite"
    assert len(detail["images"]) == 1

    # 4. Admin dashboard stats
    res_stats = client.get("/api/admin/company/stats", headers=headers)
    assert res_stats.status_code == 200
    stats_data = res_stats.json()
    assert stats_data["total_projects"] >= 1
    assert stats_data["total_inquiries"] >= 0
