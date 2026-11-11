"""
SMTP email notification service for Infovet.

Designed for complete failure isolation and optional configuration:
- Inactive by default: If SMTP is unconfigured, calls are simulated in logs without error.
- Background delivery: Dispatched asynchronously via FastAPI BackgroundTasks so requests never block.
- Error safety: All network, auth, or SMTP errors are caught and securely logged.
- Secrets are never logged or exposed in error messages.
"""

from dataclasses import dataclass
from email.message import EmailMessage
import logging
import smtplib
import socket
import time
from typing import Optional

from app.config import settings

logger = logging.getLogger(__name__)


@dataclass
class ContactNotificationData:
    name: str
    email: str
    subject: str
    message: str
    ip_address: Optional[str] = None
    created_at_str: Optional[str] = None


def _send_email_message(msg: EmailMessage, email_type: str) -> bool:
    """Internal helper to dispatch an EmailMessage over SMTP or simulate if unconfigured."""
    recipient = msg.get("To", "unknown")
    if not settings.is_email_configured:
        logger.info(
            "[EMAIL SIMULATION] SMTP is unconfigured. Skipped sending '%s' to %s. (Delivery inactive until credentials configured)",
            email_type,
            recipient,
        )
        return False

    max_retries = 2
    timeout_seconds = 10

    for attempt in range(1, max_retries + 1):
        try:
            logger.info(
                "Attempting SMTP transmission of '%s' to %s (attempt %d/%d) via %s:%s",
                email_type,
                recipient,
                attempt,
                max_retries,
                settings.smtp_host,
                settings.smtp_port,
            )

            if settings.smtp_use_ssl:
                server = smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=timeout_seconds)
            else:
                server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=timeout_seconds)

            with server:
                server.ehlo()
                if not settings.smtp_use_ssl and settings.effective_use_tls:
                    server.starttls()
                    server.ehlo()

                username = settings.effective_smtp_user
                if username and settings.smtp_password:
                    server.login(username, settings.smtp_password)

                server.send_message(msg)

            logger.info("Successfully delivered '%s' email to %s", email_type, recipient)
            return True

        except (smtplib.SMTPException, socket.error, TimeoutError, OSError) as exc:
            logger.error(
                "SMTP transmission failed for '%s' (attempt %d/%d): %s",
                email_type,
                attempt,
                max_retries,
                str(exc) or exc.__class__.__name__,
            )
            if attempt < max_retries:
                time.sleep(1.0)
        except Exception as exc:
            logger.error(
                "Unexpected error during email delivery for '%s' (attempt %d/%d): %s",
                email_type,
                attempt,
                max_retries,
                exc.__class__.__name__,
            )
            if attempt < max_retries:
                time.sleep(1.0)

    logger.warning("Could not deliver '%s' email to %s after %d attempts.", email_type, recipient, max_retries)
    return False


def send_contact_notification(data: ContactNotificationData) -> bool:
    """Sends an email notification for a submitted contact form."""
    msg = EmailMessage()
    msg["Subject"] = f"[Infovet Contact] {data.subject}"
    msg["From"] = f"{settings.effective_sender_name} <{settings.effective_sender_email}>"
    msg["To"] = settings.effective_receiver_email
    msg["Reply-To"] = f"{data.name} <{data.email}>"

    timestamp = data.created_at_str or "Just now"
    ip = data.ip_address or "Unknown"
    body = (
        f"New Contact Form Submission on Infovet\n"
        f"=====================================\n\n"
        f"From:       {data.name} <{data.email}>\n"
        f"Date:       {timestamp}\n"
        f"IP Address: {ip}\n"
        f"Subject:    {data.subject}\n\n"
        f"Message:\n"
        f"-------------------------------------\n"
        f"{data.message}\n"
        f"-------------------------------------\n\n"
        f"Reply directly to this email to contact {data.name}."
    )
    msg.set_content(body)
    return _send_email_message(msg, "Contact Notification")


def send_otp_email(to_email: str, full_name: str, otp_code: str) -> bool:
    """Prepared OTP verification email dispatcher."""
    msg = EmailMessage()
    msg["Subject"] = f"Your Infovet Verification Code: {otp_code}"
    msg["From"] = f"{settings.effective_sender_name} <{settings.effective_sender_email}>"
    msg["To"] = to_email
    body = (
        f"Hello {full_name},\n\n"
        f"Your Infovet verification code is:\n\n"
        f"    {otp_code}\n\n"
        f"This code will expire in 15 minutes. If you did not request this verification, please ignore this email.\n\n"
        f"Best regards,\n"
        f"The Infovet Team"
    )
    msg.set_content(body)
    return _send_email_message(msg, "OTP Verification")


def send_welcome_email(to_email: str, full_name: str) -> bool:
    """Welcoming newly registered users to Infovet."""
    msg = EmailMessage()
    msg["Subject"] = "Welcome to Infovet — Your Professional Career Portal"
    msg["From"] = f"{settings.effective_sender_name} <{settings.effective_sender_email}>"
    msg["To"] = to_email
    body = (
        f"Hello {full_name},\n\n"
        f"Welcome to Infovet! Your professional account has been successfully created.\n\n"
        f"You can now explore open roles, customize your professional profile, upload your CV, "
        f"and track your applications in real-time.\n\n"
        f"Best regards,\n"
        f"The Infovet Team\n"
        f"https://infovet.io"
    )
    msg.set_content(body)
    return _send_email_message(msg, "Welcome Email")


def send_application_confirmation_email(
    to_email: str, full_name: str, job_title: str, company_name: str
) -> bool:
    """Confirms receipt of a candidate's job application."""
    msg = EmailMessage()
    msg["Subject"] = f"Application Submitted: {job_title} at {company_name}"
    msg["From"] = f"{settings.effective_sender_name} <{settings.effective_sender_email}>"
    msg["To"] = to_email
    body = (
        f"Hello {full_name},\n\n"
        f"Your application for the '{job_title}' role at {company_name} has been successfully submitted.\n\n"
        f"The hiring team has received your profile and resume. You can track the status of your application "
        f"anytime under 'My Applications' on your Infovet dashboard.\n\n"
        f"Best of luck!\n"
        f"The Infovet Team"
    )
    msg.set_content(body)
    return _send_email_message(msg, "Application Confirmation")


def send_application_status_update_email(
    to_email: str, full_name: str, job_title: str, new_status: str, company_name: str
) -> bool:
    """Notifies a candidate of an update in their application status."""
    formatted_status = new_status.capitalize()
    msg = EmailMessage()
    msg["Subject"] = f"Application Update: {job_title} at {company_name} ({formatted_status})"
    msg["From"] = f"{settings.effective_sender_name} <{settings.effective_sender_email}>"
    msg["To"] = to_email
    body = (
        f"Hello {full_name},\n\n"
        f"There has been an update regarding your application for '{job_title}' at {company_name}.\n\n"
        f"Current Status: {formatted_status}\n\n"
        f"Log in to your Infovet account to view full feedback and next steps.\n\n"
        f"Best regards,\n"
        f"The Infovet Team"
    )
    msg.set_content(body)
    return _send_email_message(msg, "Status Update")
