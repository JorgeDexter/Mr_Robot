"""
Face detection and encoding service.
Uses face_recognition library for 128-d embedding extraction.
Falls back to OpenCV Haar cascades if face_recognition is unavailable.
"""

import json
import numpy as np
import cv2
from typing import Optional, List

# Try to import face_recognition; fall back to OpenCV-only mode
try:
    import face_recognition
    USE_FACE_RECOGNITION = True
except ImportError:
    USE_FACE_RECOGNITION = False


def detect_and_encode(image_path: str) -> Optional[str]:
    """
    Detect a face in the image and return its encoding as a JSON string.
    Returns None if no face is detected.
    """
    if USE_FACE_RECOGNITION:
        return _encode_with_face_recognition(image_path)
    else:
        return _encode_with_opencv(image_path)


def _encode_with_face_recognition(image_path: str) -> Optional[str]:
    """Use face_recognition library for detection + 128-d encoding."""
    image = face_recognition.load_image_file(image_path)
    encodings = face_recognition.face_encodings(image)

    if len(encodings) == 0:
        return None

    # Take the first detected face
    encoding = encodings[0]
    return json.dumps(encoding.tolist())


def _encode_with_opencv(image_path: str) -> Optional[str]:
    """
    Fallback: use OpenCV Haar cascade for face detection.
    Generates a simple pixel-based feature vector (not as robust, but works for demo).
    """
    image = cv2.imread(image_path)
    if image is None:
        return None

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Load Haar cascade for face detection
    cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv2.CascadeClassifier(cascade_path)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60))

    if len(faces) == 0:
        return None

    # Extract the first face region
    x, y, w, h = faces[0]
    face_roi = gray[y:y+h, x:x+w]

    # Resize to standard size and flatten to create a simple feature vector
    face_resized = cv2.resize(face_roi, (32, 32))
    # Normalize and reduce to 128 dimensions via simple averaging
    flat = face_resized.flatten().astype(np.float64) / 255.0
    # Reduce 1024-d to 128-d by averaging groups of 8
    encoding = np.mean(flat.reshape(128, -1), axis=1)

    return json.dumps(encoding.tolist())


def load_encoding(encoding_json: str) -> np.ndarray:
    """Deserialize a stored encoding back to a numpy array."""
    return np.array(json.loads(encoding_json))


def compare_faces(
    known_encodings: List[np.ndarray],
    unknown_encoding: np.ndarray,
    tolerance: float = 0.6,
) -> List[bool]:
    """
    Compare an unknown face encoding against a list of known encodings.
    Returns a list of booleans indicating matches.
    (Prepared for Module 2 - live anonymization.)
    """
    if USE_FACE_RECOGNITION:
        return face_recognition.compare_faces(known_encodings, unknown_encoding, tolerance=tolerance)
    else:
        results = []
        for known in known_encodings:
            distance = np.linalg.norm(known - unknown_encoding)
            results.append(distance < tolerance)
        return results
