from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.tutor import TutorProfile
    from app.models.user import User


class Review(Base):
    __tablename__ = "reviews"
    __table_args__ = (
        CheckConstraint("rating BETWEEN 1 AND 5", name="ck_reviews_rating"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_profile_id: Mapped[int] = mapped_column(
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True
    )
    booking_id: Mapped[int | None] = mapped_column(Integer, index=True)
    rating: Mapped[int] = mapped_column(Integer)
    comment: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), index=True
    )

    tutor_profile: Mapped[TutorProfile] = relationship(back_populates="reviews")
    user: Mapped[User | None] = relationship(back_populates="reviews")
