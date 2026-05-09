"""
Pydantic schemas for user-related request/response validation.
"""

from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration request."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_]+$")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)


class UserResponse(BaseModel):
    """Schema for user creation response."""
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfile(BaseModel):
    """Schema for authenticated user profile (includes face count)."""
    id: int
    username: str
    email: str
    created_at: datetime
    face_count: int = 0

    class Config:
        from_attributes = True
