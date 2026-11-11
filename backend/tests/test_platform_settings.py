"""
Automated unit tests for dynamic platform settings and branding APIs.
"""

from fastapi.testclient import TestClient
import pytest

from app.core.security import create_access_token, hash_password
from app.database import Base, get_db
from app.main import app
from app.models.platform_setting import PlatformSetting
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
        email="test_admin_settings@infovet.io",
        hashed_password=hash_password("AdminSecurePassword123"),
        full_name="Settings Test Administrator",
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
        email="test_customer_settings@infovet.io",
        hashed_password=hash_password("CustomerPassword123"),
        full_name="Regular Candidate",
        role="customer",
        is_active=True,
    )
    db_session.add(customer)
    db_session.commit()
    db_session.refresh(customer)
    return create_access_token(subject=customer.id, role="customer")


def test_public_settings_accessible_without_auth(client):
    """GET /api/settings/public must be freely accessible to anyone and return safe branding."""
    res = client.get("/api/settings/public")
    assert res.status_code == 200
    data = res.json()
    assert "platform_name" in data
    assert "tagline" in data
    assert "support_email" in data
    # Ensure sensitive database or deployment fields are never exposed
    assert "DATABASE_URL" not in str(data)
    assert "jwt_secret_key" not in str(data)
    assert "smtp_password" not in str(data)


def test_admin_settings_requires_admin_role(client, customer_token):
    """Candidate users and unauthenticated users cannot access or edit admin branding."""
    # Unauthenticated
    res_anon = client.get("/api/admin/settings/branding")
    assert res_anon.status_code == 401

    # Authenticated as customer (non-admin)
    res_customer = client.get(
        "/api/admin/settings/branding",
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert res_customer.status_code == 403


def test_admin_can_update_platform_branding(client, admin_token):
    """Admin can dynamically update platform name, logo URL, colors, and tagline."""
    headers = {"Authorization": f"Bearer {admin_token}"}

    update_payload = {
        "platform_name": "Acme Global Careers",
        "platform_logo_url": "https://cdn.example.com/acme-logo.svg",
        "favicon_url": "https://cdn.example.com/acme-favicon.ico",
        "tagline": "Discover High-Growth Leadership Roles",
        "primary_color": "#4F46E5",
        "support_email": "careers@acme.com",
        "contact_phone": "+1 (800) 555-0199",
    }

    res_put = client.put("/api/admin/settings/branding", json=update_payload, headers=headers)
    assert res_put.status_code == 200
    updated_data = res_put.json()
    assert updated_data["platform_name"] == "Acme Global Careers"
    assert updated_data["platform_logo_url"] == "https://cdn.example.com/acme-logo.svg"
    assert updated_data["primary_color"] == "#4F46E5"
    assert updated_data["updated_by"] == "test_admin_settings@infovet.io"

    # Verify public settings endpoint immediately reflects the database changes
    res_pub = client.get("/api/settings/public")
    assert res_pub.status_code == 200
    pub_data = res_pub.json()
    assert pub_data["platform_name"] == "Acme Global Careers"
    assert pub_data["platform_logo_url"] == "https://cdn.example.com/acme-logo.svg"
    assert pub_data["tagline"] == "Discover High-Growth Leadership Roles"
    assert pub_data["primary_color"] == "#4F46E5"


def test_admin_can_upload_logo_and_serve(client, admin_token, customer_token):
    """Admin can upload logo files and retrieve them via safe public delivery endpoint."""
    fake_png = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"

    # 1. Unauthenticated fails
    res_anon = client.post(
        "/api/uploads/logo",
        files={"file": ("test_logo.png", fake_png, "image/png")},
    )
    assert res_anon.status_code == 401

    # 2. Customer role fails
    res_cust = client.post(
        "/api/uploads/logo",
        files={"file": ("test_logo.png", fake_png, "image/png")},
        headers={"Authorization": f"Bearer {customer_token}"},
    )
    assert res_cust.status_code == 403

    # 3. Invalid file format fails
    res_bad = client.post(
        "/api/uploads/logo",
        files={"file": ("malicious.exe", b"binarycontent", "application/x-msdownload")},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_bad.status_code == 400
    assert "Invalid logo image type" in res_bad.json()["detail"]

    # 4. Valid logo upload succeeds
    res_admin = client.post(
        "/api/uploads/logo",
        files={"file": ("company_brand.png", fake_png, "image/png")},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert res_admin.status_code == 200
    data = res_admin.json()
    assert "url" in data
    assert data["url"].startswith("/api/uploads/logos/")

    # 5. Delivery endpoint serves the logo file
    res_serve = client.get(data["url"])
    assert res_serve.status_code == 200
    assert res_serve.content == fake_png


