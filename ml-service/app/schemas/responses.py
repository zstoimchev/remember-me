from typing import Any, Optional

def success_response(data: Any, request_id: str) -> dict:
    return {
        "success": True,
        "data": data,
        "requestId": request_id,
    }

def error_response(code: str, message: str, request_id: str) -> dict:
    return {
        "success": False,
        "error": {
            "code": code,
            "message": message,
            "requestId": request_id,
        },
    }