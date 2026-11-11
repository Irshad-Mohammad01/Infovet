"""
Tests for public Contact Us endpoint /api/contact.
"""

from unittest.mock import patch
from sqlalchemy import select

from app.models.contact import Contact


def test_valid_contact_submission(client, db_session):
    """Test 1: Valid submission saves to DB and returns success response."""
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Website Inquiry",
        "message": "We would like to hire HexMap for our upcoming project.",
        "website": "",  # Empty honeypot
    }

    with patch("app.routes.contact.send_contact_notification") as mock_email:
        mock_email.return_value = True
        response = client.post("/api/contact", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["status"] == "success"
    assert "received" in data["message"].lower()

    # Verify stored in database
    records = db_session.scalars(select(Contact)).all()
    assert len(records) == 1
    record = records[0]
    assert record.name == "Jane Doe"
    assert record.email == "jane@example.com"
    assert record.subject == "Website Inquiry"
    assert record.message == "We would like to hire HexMap for our upcoming project."
    assert record.created_at is not None


def test_invalid_email_submission(client, db_session):
    """Test 2: Invalid email address returns 422 validation error."""
    payload = {
        "name": "Jane Doe",
        "email": "not-a-valid-email",
        "subject": "Website Inquiry",
        "message": "Hello HexMap",
    }

    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert "detail" in data

    # Verify no record was created in database
    records = db_session.scalars(select(Contact)).all()
    assert len(records) == 0


def test_missing_required_fields(client):
    """Test 3: Missing required field returns 422."""
    payload = {
        "name": "Jane Doe",
        # Missing email
        "subject": "Hello",
        "message": "World",
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 422


def test_honeypot_rejection(client, db_session):
    """Test 4: Bots filling the hidden 'website' field are rejected and not stored."""
    payload = {
        "name": "Spam Bot",
        "email": "bot@spammer.com",
        "subject": "Spam Subject",
        "message": "Spam message body",
        "website": "http://spam.example.com",  # Honeypot filled!
    }

    with patch("app.routes.contact.send_contact_notification") as mock_email:
        response = client.post("/api/contact", json=payload)
        mock_email.assert_not_called()

    # Must reject the bot request
    assert response.status_code == 400
    assert "invalid submission" in response.json()["detail"].lower()

    # Database must not store bot submissions
    records = db_session.scalars(select(Contact)).all()
    assert len(records) == 0


def test_rate_limiting(client):
    """Test 5: Exceeding rate limit returns 429 Too Many Requests."""
    payload = {
        "name": "Tester",
        "email": "tester@example.com",
        "subject": "Test",
        "message": "Testing rate limit",
    }

    # Limit is 5 per window
    for _ in range(5):
        resp = client.post("/api/contact", json=payload)
        assert resp.status_code == 201

    # 6th attempt should be blocked
    resp = client.post("/api/contact", json=payload)
    assert resp.status_code == 429
    assert "too many messages" in resp.json()["detail"].lower()


def test_no_public_contact_read_endpoints(client):
    """Test 6: Verify NO public read API endpoints exist for contacts."""
    assert client.get("/api/contacts").status_code in (404, 405)
    assert client.get("/api/contact").status_code in (404, 405)
    assert client.get("/contacts").status_code in (404, 405)
    assert client.get("/api/admin/messages").status_code in (404, 405)
    assert client.get("/api/admin/contacts").status_code in (404, 405)


def test_health_check(client):
    """Test 7: Health check returns system status."""
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["database_connected"] is True
