from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Level, Location, Subject
from app.schemas.catalog import LevelOut, LocationOut, SubjectOut

router = APIRouter(tags=["catalog"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/subjects", response_model=list[SubjectOut])
async def get_subjects(db: DbSession) -> list[Subject]:
    return list(db.scalars(select(Subject).order_by(Subject.id)).all())


@router.get("/levels", response_model=list[LevelOut])
async def get_levels(db: DbSession) -> list[Level]:
    return list(db.scalars(select(Level).order_by(Level.id)).all())


@router.get("/locations", response_model=list[LocationOut])
async def get_locations(db: DbSession) -> list[Location]:
    return list(
        db.scalars(select(Location).order_by(Location.city, Location.district)).all()
    )
