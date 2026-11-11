"""
Public contact route for the HexMap Contact Us form.
Matches the contract of frontend/src/components/ContactForm.jsx.
"""

import logging
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactCreate, SimpleMessage
from app.services.email import ContactNotificationData, send_contact_notification
from app.services.rate_limiter import rate_limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["contact"])


def get_client_ip(request: Request) -> Optional[str]:
    """Extracts client IP from proxy headers or direct socket connection."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip.strip()
    return request.client.host if request.client else None


@router.post(
    "/contact",
    response_model=SimpleMessage,
    status_code=status.HTTP_201_CREATED,
    summary="Submit Contact Us form",
)
def submit_contact(
    payload: ContactCreate,
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
) -> SimpleMessage:
    client_ip = get_client_ip(request)

    # 1. Honeypot validation
    # If the hidden 'website' field was filled, reject the bot request immediately.
    if payload.website:
        logger.warning("Bot submission rejected: honeypot field filled from IP %s", client_ip)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid submission detected.",
        )

    # 2. Rate limit check (basic abuse protection)
    rate_limiter.check_rate_limit(client_ip)

    # 3. Stage 1: Store in configured database
    try:
        contact_record = Contact(
            name=payload.name,
            email=payload.email,
            subject=payload.subject,
            message=payload.message,
        )
        db.add(contact_record)
        db.commit()
        db.refresh(contact_record)
    except Exception as exc:
        db.rollback()
        logger.error("Database error saving contact submission: %s", exc.__class__.__name__)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We were unable to save your message due to a server error. Please try again later.",
        )

    # 4. Stage 2: Send SMTP email notification in background
    # Email failure never rolls back the database or delays the visitor
    if settings.is_email_configured:
        notification_data = ContactNotificationData(
            name=contact_record.name,
            email=contact_record.email,
            subject=contact_record.subject,
            message=contact_record.message,
            ip_address=client_ip,
            created_at_str=contact_record.created_at.strftime("%d %b %Y, %H:%M IST") if contact_record.created_at else None,
        )
        background_tasks.add_task(send_contact_notification, notification_data)
    else:
        logger.info("Message %d saved to database. Outbound email skipped (SMTP unconfigured).", contact_record.id)

    return SimpleMessage(
        status="success",
        message="Thanks — your message has been received. We usually reply within a couple of working days.",
    )


@router.get(
    "/health",
    tags=["meta"],
    summary="System health check",
)
def health_check(db: Session = Depends(get_db)) -> dict:
    db_healthy = False
    try:
        db.execute(text("SELECT 1"))
        db_healthy = True
    except Exception as exc:
        logger.error("Health check database query failed: %s", exc.__class__.__name__)

    return {
        "status": "ok" if db_healthy else "degraded",
        "database_connected": db_healthy,
        "email_configured": settings.is_email_configured,
    }
