"""
Pydantic schemas for authentication tokens.
"""

from typing import Optional
from pydantic import BaseModel


class Token(BaseModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Decoded token payload data."""
    username: Optional[str] = None
