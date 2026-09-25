from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.models import Subject
from app.schemas.subject import SubjectResponse

router = APIRouter(prefix="/subjects", tags=["Subjects"])

@router.get("", response_model=List[SubjectResponse])
def get_subjects(db: Session = Depends(get_db)):
    """Lấy danh sách tất cả môn học."""
    return db.query(Subject).order_by(Subject.id).all()
