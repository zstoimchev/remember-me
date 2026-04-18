import logging
import numpy as np
import cv2

from fastapi import APIRouter, UploadFile, File

from deepface import DeepFace

from app.core.request_context import get_request_id
from app.schemas.responses import success_response

# methods we're trying out

from app.core.errors import (
    InvalidImageError,
    FaceNotDetectedError,
    MultipleFacesDetectedError,
)

router = APIRouter()
logger = logging.getLogger("ml-service.recognize")


@router.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    request_id = get_request_id()

    logger.info(f"[{request_id}] /recognize called")

    contents = await file.read()
    if not contents:
        raise InvalidImageError("Empty image")

    np_arr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise InvalidImageError("Could not decode image")

    logger.info(f"[{request_id}] image decoded: shape={img.shape}")

    try:
        faces = DeepFace.extract_faces(
            img_path=img,
            detector_backend="opencv",
            enforce_detection=False,
            align=True,
        )
    except Exception as e:
        logger.exception(f"[{request_id}] DeepFace detection failed: {str(e)}")
        raise InvalidImageError("Face detection failed")

    face_count = len(faces)
    logger.info(f"[{request_id}] detected_faces={face_count}")

    if face_count == 0:
        raise FaceNotDetectedError()

    if face_count > 1:
        raise MultipleFacesDetectedError()

    embedding_obj = DeepFace.represent(
        img_path=img,
        model_name="Facenet",
        enforce_detection=False
    )

    embedding = embedding_obj[0]["embedding"]
    logger.info(f"[{request_id}] embedding generated: length={len(embedding)}")

    facial_area = faces[0].get("facial_area", {})

    return success_response(
        {
            "decoded": True,
            "faceDetected": True,
            "faceCount": face_count,
            "facialArea": facial_area,
            "embeddingLength": len(embedding)
        },
        request_id,
    )
        