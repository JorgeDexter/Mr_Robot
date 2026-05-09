"""
User profile routes (JWT-protected).
"""

from fastapi import APIRouter, Depends

from app.models.user import User
from app.schemas.user import UserProfile
from app.utils.security import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: User = Depends(get_current_user)):
    """Get the authenticated user's profile with face enrollment count."""
    return UserProfile(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        created_at=current_user.created_at,
        face_count=len(current_user.face_data),
    )
