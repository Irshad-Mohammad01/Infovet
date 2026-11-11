"""
Pydantic schemas for authentication, authorization, and user profiles.
"""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr = Field(..., max_length=255, description="User email address")
    password: str = Field(..., min_length=6, max_length=128, description="User password")
    full_name: str = Field(..., min_length=1, max_length=120, description="Full name")
    phone: Optional[str] = Field(default=None, max_length=30)
    role: Optional[str] = Field(default="customer", description="'customer' or 'admin'")


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="User login email")
    password: str = Field(..., description="User password")


class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    is_verified: bool
    headline: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[str] = None
    avatar_url: Optional[str] = None
    resume_url: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, max_length=120)
    phone: Optional[str] = Field(default=None, max_length=30)
    headline: Optional[str] = Field(default=None, max_length=150)
    bio: Optional[str] = None
    location: Optional[str] = Field(default=None, max_length=120)
    skills: Optional[str] = None
    avatar_url: Optional[str] = Field(default=None, max_length=500)
    resume_url: Optional[str] = Field(default=None, max_length=500)
    github_url: Optional[str] = Field(default=None, max_length=255)
    linkedin_url: Optional[str] = Field(default=None, max_length=255)
    portfolio_url: Optional[str] = Field(default=None, max_length=255)


class PasswordChange(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=128)


class OTPVerify(BaseModel):
    email: EmailStr
    otp_code: str = Field(..., min_length=4, max_length=10)

