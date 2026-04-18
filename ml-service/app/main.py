import logging

from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from app.core.logging_config import setup_logging
from app.core.errors import AppError
from app.schemas.responses import error_response
from app.routes.health import router as health_router
from app.routes.recognize import router as recognize_router

setup_logging()
logger = logging.getLogger("ml-service")

@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    yield

app = FastAPI(title="Remember Me ML Service", lifespan=lifespan)

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    request_id = request.headers.get("x-request-id", "unknown")
    logger.warning(f"[{request_id}] AppError: {exc.code} - {exc.message}")

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response(exc.code, exc.message, request_id),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    request_id = request.headers.get("x-request-id", "unknown")
    logger.warning(f"[{request_id}] HTTPException: {exc.detail}")

    return JSONResponse(
        status_code=exc.status_code,
        content=error_response("HTTP_ERROR", str(exc.detail), request_id),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    request_id = request.headers.get("x-request-id", "unknown")
    logger.exception(f"[{request_id}] Unhandled exception: {str(exc)}")

    return JSONResponse(
        status_code=500,
        content=error_response("INTERNAL_ERROR", "Internal server error", request_id),
    )


app.include_router(health_router)
app.include_router(recognize_router)