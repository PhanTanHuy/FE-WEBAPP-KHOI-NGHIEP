from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional

from app.api.deps import get_db, get_current_user
from app.models.models import Review, TutorProfile, Booking, User
from app.schemas.review import ReviewCreate, ReviewResponse

router = APIRouter(prefix="/reviews", tags=["reviews"])

@router.post("/", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # 1. Verify tutor profile exists
    tutor = db.query(TutorProfile).filter(TutorProfile.id == review_in.tutor_profile_id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ gia sư")

    # 2. Check if booking_id is provided
    if review_in.booking_id:
        booking = db.query(Booking).filter(Booking.id == review_in.booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Không tìm thấy lịch học này")
        if booking.student_id != current_user.id:
            raise HTTPException(status_code=403, detail="Bạn không có quyền đánh giá buổi học này")
        
        # Check if already reviewed for this booking
        existing = db.query(Review).filter(Review.booking_id == review_in.booking_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Buổi học này đã được đánh giá rồi")

    # 3. Create review
    review = Review(
        tutor_profile_id=review_in.tutor_profile_id,
        user_id=current_user.id,
        booking_id=review_in.booking_id,
        rating=review_in.rating,
        comment=review_in.comment
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # 4. Recalculate tutor's average rating and review_count
    stats = db.query(
        func.avg(Review.rating).label("avg_rating"),
        func.count(Review.id).label("total_reviews")
    ).filter(Review.tutor_profile_id == tutor.id).first()

    if stats and stats.total_reviews:
        tutor.rating = round(float(stats.avg_rating), 1)
        tutor.review_count = int(stats.total_reviews)
    else:
        tutor.rating = float(review.rating)
        tutor.review_count = 1
        
    db.commit()

    return review

@router.get("/tutor/{tutor_id}", response_model=List[ReviewResponse])
def get_tutor_reviews(
    tutor_id: int,
    db: Session = Depends(get_db)
):
    reviews = db.query(Review).filter(
        Review.tutor_profile_id == tutor_id
    ).order_by(Review.created_at.desc()).all()
    return reviews

@router.get("/my", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reviews = db.query(Review).filter(
        Review.user_id == current_user.id
    ).order_by(Review.created_at.desc()).all()
    return reviews

@router.get("/check-booking/{booking_id}")
def check_booking_review(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    review = db.query(Review).filter(
        Review.booking_id == booking_id,
        Review.user_id == current_user.id
    ).first()
    return {
        "reviewed": review is not None,
        "review_id": review.id if review else None,
        "rating": review.rating if review else None,
        "comment": review.comment if review else None
    }
