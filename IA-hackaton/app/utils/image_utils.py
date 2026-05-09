"""
Image validation and processing utilities.
"""

from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import settings


def validate_image_file(file: UploadFile) -> None:
    """
    Validate an uploaded file:
    - Must have an allowed extension (jpg, jpeg, png)
    - Content type must be an image
    - File size is checked on read
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must have a filename.",
        )

    extension = Path(file.filename).suffix.lower().lstrip(".")
    if extension not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type '.{extension}'. Allowed: {', '.join(settings.ALLOWED_EXTENSIONS)}",
        )

    # Validate content type
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid content type '{file.content_type}'. Must be an image.",
        )


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks.
    Strips directory components and dangerous characters.
    """
    # Get only the filename part (no directory traversal)
    safe_name = Path(filename).name
    # Remove any remaining problematic characters
    safe_name = "".join(c for c in safe_name if c.isalnum() or c in "._-")
    return safe_name or "upload.jpg"
