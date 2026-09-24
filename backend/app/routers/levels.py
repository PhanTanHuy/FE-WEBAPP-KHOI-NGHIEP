from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Level
from app.schemas.level import LevelResponse

router = APIRouter(prefix="/levels", tags=["Levels"])

@router.get("", response_model=List[LevelResponse])
def get_levels(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả cấp học."""
    return db.query(Level).order_by(Level.id).all()
