"""
Face image upload routes (JWT-protected).
Handles multi-file upload, validation, detection, and encoding.
"""

from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.face_data import FaceData
from app.utils.security import get_current_user
from app.utils.image_utils import validate_image_file
from app.services.storage_service import save_upload, delete_file
from app.services.face_service import detect_and_encode

router = APIRouter(prefix="/upload", tags=["Face Upload"])


@router.post("/faces")
async def upload_faces(
    files: List[UploadFile] = File(..., description="One or more face images (jpg/jpeg/png)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Upload multiple face images for the authenticated user.
    Each image is validated, saved, and processed for face detection + encoding.
    Images without a detectable face are rejected.
    """
    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided.",
        )

    results = []

    for file in files:
        result = {"filename": file.filename, "status": "error", "face_detected": False, "detail": ""}

        try:
            # Validate file type
            validate_image_file(file)

            # Save to local storage
            file_path = await save_upload(current_user.id, file)

            # Detect face and generate encoding
            encoding_json = detect_and_encode(file_path)

            if encoding_json is None:
                # No face detected — remove the saved file
                delete_file(file_path)
                result["detail"] = "No face detected in image. File rejected."
                results.append(result)
                continue

            # Save metadata to database
            face_record = FaceData(
                user_id=current_user.id,
                image_path=file_path,
                encoding_data=encoding_json,
                face_detected=True,
            )
            db.add(face_record)
            db.commit()

            result["status"] = "success"
            result["face_detected"] = True
            result["detail"] = "Face detected and encoding saved."

        except HTTPException as e:
            result["detail"] = e.detail
        except ValueError as e:
            result["detail"] = str(e)
        except Exception as e:
            result["detail"] = f"Processing error: {str(e)}"

        results.append(result)

    # Summary
    successful = sum(1 for r in results if r["status"] == "success")
    return {
        "uploaded": successful,
        "total_submitted": len(files),
        "results": results,
    }


@router.get("/faces", summary="List enrolled faces")
async def list_faces(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all enrolled face records for the current user."""
    records = db.query(FaceData).filter(FaceData.user_id == current_user.id).all()
    return {
        "user_id": current_user.id,
        "face_count": len(records),
        "faces": [
            {
                "id": r.id,
                "image_path": r.image_path,
                "face_detected": r.face_detected,
                "created_at": r.created_at.isoformat(),
            }
            for r in records
        ],
    }
