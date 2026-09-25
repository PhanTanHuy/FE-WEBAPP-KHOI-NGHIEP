from fastapi import APIRouter

from app.routers.catalog import router as catalog_router
from app.routers.tutors import router as tutors_router

api_router = APIRouter()
api_router.include_router(catalog_router)
api_router.include_router(tutors_router)
