"""
FaceData SQLAlchemy model.
Stores uploaded face image metadata and encoding vectors.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.database import Base


class FaceData(Base):
    __tablename__ = "face_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    image_path = Column(String(500), nullable=False)
    encoding_data = Column(Text, nullable=True)  # JSON-serialized 128-d vector
    face_detected = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship back to user
    user = relationship("User", back_populates="face_data")

    def __repr__(self) -> str:
        return f"<FaceData(id={self.id}, user_id={self.user_id}, detected={self.face_detected})>"
