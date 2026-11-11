"""
Pydantic schemas for contact form submission and response.
"""

from typing import Optional

from pydantic import BaseModel, EmailStr, Field, model_validator


class ContactCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=120, description="Sender name")
    email: EmailStr = Field(..., max_length=255, description="Sender email address")
    subject: str = Field(..., min_length=1, max_length=200, description="Message subject")
    message: str = Field(..., min_length=1, max_length=5000, description="Message content")
    website: Optional[str] = Field(
        default=None,
        description="Honeypot field — bots fill it; humans never see it",
    )

    @model_validator(mode="before")
    @classmethod
    def strip_strings(cls, data: dict) -> dict:
        if isinstance(data, dict):
            for key in ("name", "subject", "message", "website"):
                if key in data and isinstance(data[key], str):
                    data[key] = data[key].strip()
        return data


class SimpleMessage(BaseModel):
    status: str = "success"
    message: str = (
        "Thanks — your message has been received. We usually reply within a couple of working days."
    )
