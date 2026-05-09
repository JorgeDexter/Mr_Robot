"""
Local filesystem storage service for face images.
"""

import uuid
from pathlib import Path
from fastapi import UploadFile

from app.config import settings
from app.utils.image_utils import sanitize_filename


async def save_upload(user_id: int, file: UploadFile) -> str:
    """
    Save an uploaded file to the user's local directory.
    Returns the relative file path.
    """
    # Create user-specific directory
    user_dir = Path(settings.UPLOAD_DIR) / str(user_id)
    user_dir.mkdir(parents=True, exist_ok=True)

    # Generate unique filename to avoid collisions
    safe_name = sanitize_filename(file.filename or "upload.jpg")
    unique_name = f"{uuid.uuid4().hex[:8]}_{safe_name}"
    file_path = user_dir / unique_name

    # Read and write file content
    content = await file.read()

    # Check file size
    if len(content) > settings.MAX_FILE_SIZE:
        raise ValueError(f"File exceeds maximum size of {settings.MAX_FILE_SIZE // (1024*1024)}MB")

    with open(file_path, "wb") as f:
        f.write(content)

    return str(file_path)


def delete_file(file_path: str) -> None:
    """Delete a file from local storage if it exists."""
    path = Path(file_path)
    if path.exists():
        path.unlink()
