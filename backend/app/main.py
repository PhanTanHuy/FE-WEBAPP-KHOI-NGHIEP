import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import sys
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Configure loguru
logger.remove()
logger.add(sys.stdout, format="{time} {level} {message}", level="INFO")
logger.add("logs/app.log", rotation="50 MB", level="DEBUG")

from app.config import settings
from app.routers import (
    subjects_router, levels_router, locations_router,
    tutors_router, auth_router, tutor_applications_router,
    bookings_router, reviews_router, progress_router,
    materials_router, rides_router, admin_router, analytics_router
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup rate limiter
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Static files setup for uploads
UPLOAD_DIR = Path(__file__).resolve().parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "documents").mkdir(parents=True, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(subjects_router, prefix=settings.API_V1_STR)
app.include_router(levels_router, prefix=settings.API_V1_STR)
app.include_router(locations_router, prefix=settings.API_V1_STR)
app.include_router(tutors_router, prefix=settings.API_V1_STR)
app.include_router(tutor_applications_router, prefix=settings.API_V1_STR)
app.include_router(bookings_router, prefix=settings.API_V1_STR)
app.include_router(reviews_router, prefix=settings.API_V1_STR)
app.include_router(progress_router, prefix=settings.API_V1_STR)
app.include_router(materials_router, prefix=settings.API_V1_STR)
app.include_router(rides_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "EduConnect API is running smoothly!",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
