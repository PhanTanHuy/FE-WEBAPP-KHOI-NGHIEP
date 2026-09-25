from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
from datetime import datetime

class ReviewUserInfo(BaseModel):
    id: int
    full_name: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class ReviewBase(BaseModel):
    tutor_profile_id: int
    booking_id: Optional[int] = None
    rating: int = Field(ge=1, le=5, description="Đánh giá từ 1 đến 5 sao")
    comment: str = Field(min_length=3, description="Nội dung đánh giá")

class ReviewCreate(ReviewBase):
    pass

class ReviewResponse(ReviewBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime
    user: Optional[ReviewUserInfo] = None

    model_config = ConfigDict(from_attributes=True)
