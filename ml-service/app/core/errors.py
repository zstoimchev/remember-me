class AppError(Exception):
    def __init__(self, code: str, message: str, status_code: int = 400):
        self.code = code
        self.message = message
        self.status_code = status_code
        super().__init__(message)


class InvalidImageError(AppError):
    def __init__(self, message: str = "Invalid image input"):
        super().__init__("INVALID_IMAGE", message, 400)


class FaceNotDetectedError(AppError):
    def __init__(self, message: str = "No face detected in image"):
        super().__init__("FACE_NOT_DETECTED", message, 422)

class MultipleFacesDetectedError(AppError):
    def __init__(self, message: str = "Multiple faces detected"):
        super().__init__("MULTIPLE_FACES_DETECTED", message, 422)