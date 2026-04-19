import cv2
import numpy as np
from deepface import DeepFace
from fastapi import APIRouter, UploadFile, File
import logging

from app.core.request_context import get_request_id
from app.schemas.responses import success_response
from app.core.errors import InvalidImageError, FaceNotDetectedError

router = APIRouter()
logger = logging.getLogger("ml-service.recognize")

@router.post("/recognize")
async def recognize(file: UploadFile = File(...)):
    request_id = get_request_id()
    logger.info(f"[{request_id}] /recognize called")

    if not file:
        raise InvalidImageError("No image provided")

    contents = await file.read()
    if not contents:
        raise InvalidImageError("Empty image")

    logger.info(f"[{request_id}] image received, size={len(contents)} bytes")

    # decode bytes → numpy array
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise InvalidImageError("Could not decode image")

    try:
        embedding_obj = DeepFace.represent(
            img_path=img,
            model_name="Facenet512",
            detector_backend="opencv",
            enforce_detection=True
        )
        embedding = embedding_obj[0]["embedding"]  # 512d float list

        return success_response({
            "faceDetected": True,
            "embedding": embedding,
            "modelUsed": "Facenet512"
        }, request_id)

    except ValueError as e:
        logger.warning(f"[{request_id}] No face detected: {str(e)}")
        return success_response({
            "faceDetected": False,
            "embedding": None,
            "modelUsed": "Facenet512"
        }, request_id)