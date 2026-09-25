from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Location
from app.schemas.location import LocationResponse

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("", response_model=List[LocationResponse])
def get_locations(db: Session = Depends(get_db)):
    """Lấy danh sách các địa điểm / khu vực."""
    return db.query(Location).order_by(Location.id).all()
