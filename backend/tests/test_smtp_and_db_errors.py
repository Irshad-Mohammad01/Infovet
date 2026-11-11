"""
Tests for independent SMTP failure resilience and database error handling.
"""

from unittest.mock import MagicMock, patch
import smtplib
from sqlalchemy import select
from sqlalchemy.exc import OperationalError

from app.models.contact import Contact
from app.services.email import ContactNotificationData, send_contact_notification


def test_smtp_failure_does_not_lose_database_record(client, db_session):
    """
    Test 4: If SMTP delivery fails, the contact request MUST still be saved
    in the database, and the frontend receives a safe success response.
    """
    payload = {
        "name": "Important Client",
        "email": "client@enterprise.com",
        "subject": "Enterprise Contract Inquiry",
        "message": "We want to sign an enterprise agreement.",
    }

    # Simulate SMTP failure
    with patch("app.services.email.smtplib.SMTP") as mock_smtp:
        instance = MagicMock()
        instance.__enter__.return_value = instance
        instance.login.side_effect = smtplib.SMTPAuthenticationError(535, b"Authentication failed")
        mock_smtp.return_value = instance

        response = client.post("/api/contact", json=payload)

    # 1. Frontend receives safe success response
    assert response.status_code == 201
    assert response.json()["status"] == "success"

    # 2. Record is safely stored in database
    records = db_session.scalars(
        select(Contact).where(Contact.email == "client@enterprise.com")
    ).all()
    assert len(records) == 1
    assert records[0].name == "Important Client"
    assert records[0].message == "We want to sign an enterprise agreement."


def test_send_contact_notification_handles_smtp_exceptions():
    """send_contact_notification never raises and safely logs errors."""
    data = ContactNotificationData(
        name="John Doe",
        email="john@example.com",
        subject="Hello",
        message="World",
    )

    with patch("app.services.email.smtplib.SMTP") as mock_smtp:
        instance = MagicMock()
        instance.__enter__.return_value = instance
        instance.send_message.side_effect = smtplib.SMTPServerDisconnected("Server disconnected")
        mock_smtp.return_value = instance

        # Must not raise an exception
        result = send_contact_notification(data)
        assert result is False


def test_database_failure_returns_controlled_500_without_leaks(client):
    """
    Test 3: Database failure returns controlled error without leaking internal
    credentials, hostnames, or raw stack traces.
    """
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "subject": "Inquiry",
        "message": "Test message",
    }

    # Mock Session.commit to raise an OperationalError containing sensitive-looking string
    with patch("sqlalchemy.orm.Session.commit") as mock_commit:
        mock_commit.side_effect = OperationalError(
            statement="INSERT INTO contacts...",
            params={"password": "secret_db_password_123"},
            orig=Exception("FATAL: connection to postgresql://user:secret_db_password_123@neon.tech failed"),
        )
        response = client.post("/api/contact", json=payload)

    # Must be 500 error
    assert response.status_code == 500
    data = response.json()
    detail = data.get("detail", "")

    # Must NOT expose credentials, host, or SQL
    assert "secret_db_password_123" not in detail
    assert "neon.tech" not in detail
    assert "INSERT INTO" not in detail
    assert "Traceback" not in detail
    assert "unable to save your message" in detail.lower()
