from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Booking, User, TutorProfile, Subject
from app.schemas.booking import BookingCreate, BookingResponse, BookingUpdateStatus
from app.api.deps import get_current_user

router = APIRouter(prefix="/bookings", tags=["bookings"])

@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verify tutor exists
    tutor = db.query(TutorProfile).filter(TutorProfile.id == booking_in.tutor_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Tutor not found")
        
    # Verify subject exists if provided
    if booking_in.subject_id:
        subject = db.query(Subject).filter(Subject.id == booking_in.subject_id).first()
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")

    booking = Booking(
        student_id=current_user.id,
        tutor_id=booking_in.tutor_id,
        subject_id=booking_in.subject_id,
        date=booking_in.date,
        start_time=booking_in.start_time,
        end_time=booking_in.end_time,
        notes=booking_in.notes,
        status="pending"
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking

@router.get("/my-bookings", response_model=List[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Bookings where current user is the student
    bookings = db.query(Booking).filter(Booking.student_id == current_user.id).order_by(Booking.created_at.desc()).all()
    return bookings

@router.get("/tutor-bookings", response_model=List[BookingResponse])
def get_tutor_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Bookings where current user is the tutor
    if not current_user.tutor_profile:
        raise HTTPException(status_code=403, detail="User is not a tutor")
        
    bookings = db.query(Booking).filter(Booking.tutor_id == current_user.tutor_profile.id).order_by(Booking.created_at.desc()).all()
    return bookings

@router.patch("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: BookingUpdateStatus,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    valid_statuses_for_student = ["cancelled"]
    valid_statuses_for_tutor = ["confirmed", "rejected", "completed", "cancelled"]

    is_student = booking.student_id == current_user.id
    is_tutor = current_user.tutor_profile and booking.tutor_id == current_user.tutor_profile.id

    if not is_student and not is_tutor:
        raise HTTPException(status_code=403, detail="Not authorized to update this booking")

    if is_student and status_update.status not in valid_statuses_for_student:
        raise HTTPException(status_code=403, detail=f"Student cannot set status to {status_update.status}")
        
    if is_tutor and status_update.status not in valid_statuses_for_tutor:
        raise HTTPException(status_code=403, detail=f"Tutor cannot set status to {status_update.status}")

    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking
