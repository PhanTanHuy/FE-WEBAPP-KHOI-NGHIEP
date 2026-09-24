from app.routers.subjects import router as subjects_router
from app.routers.levels import router as levels_router
from app.routers.locations import router as locations_router
from app.routers.tutors import router as tutors_router
from app.routers.auth import router as auth_router
from app.routers.tutor_applications import router as tutor_applications_router
from app.routers.bookings import router as bookings_router
from app.routers.reviews import router as reviews_router
from app.routers.progress import router as progress_router
from app.routers.materials import router as materials_router
from app.routers.rides import router as rides_router
from app.routers.admin import router as admin_router
from app.routers.analytics import router as analytics_router

__all__ = [
    "subjects_router",
    "levels_router",
    "locations_router",
    "tutors_router",
    "auth_router",
    "tutor_applications_router",
    "bookings_router",
    "reviews_router",
    "progress_router",
    "materials_router",
    "rides_router",
    "admin_router",
    "analytics_router"
]
