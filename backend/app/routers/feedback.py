# app/routers/feedback.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import (
    FeedbackSubmission
)

from app.schemas.feedback import FeedbackCreate, FeedbackResponse

router = APIRouter(
    prefix="/feedback",
    tags=["Feedback"]
)


@router.post(
    "",
    response_model=FeedbackResponse,
    status_code=status.HTTP_201_CREATED
)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db)
):
    """
    Public API.
    Người dùng có thể gửi feedback mà không cần đăng nhập.
    """

    try:
        feedback = FeedbackSubmission(
            role=feedback_data.role,
            source=feedback_data.source,
            purpose=feedback_data.purpose,
            found_information=feedback_data.found_information,
            ease_of_use=feedback_data.ease_of_use,

            # Frontend gửi interested_features
            # nhưng database lưu desired_features
            desired_features=(
                ", ".join(feedback_data.interested_features)
                if feedback_data.interested_features
                else None
            ),

            tutor_priority=feedback_data.tutor_priority,
            price_range=feedback_data.price_range,
            trust_level=feedback_data.trust_level,
            usage_intention=feedback_data.usage_intention,
            difficulty=feedback_data.difficulty,

            contact_requested=feedback_data.contact_requested,
            contact_value=feedback_data.contact_value,

            answers=feedback_data.answers or {}
        )

        db.add(feedback)
        db.commit()
        db.refresh(feedback)
        return feedback
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi lưu góp ý: {str(e)}"
        )