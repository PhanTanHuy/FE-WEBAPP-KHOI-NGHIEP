from __future__ import annotations

from datetime import time
from typing import TYPE_CHECKING

from sqlalchemy import (
    Boolean,
    CheckConstraint,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base

if TYPE_CHECKING:
    from app.models.catalog import Level, Location, Subject
    from app.models.review import Review
    from app.models.user import User


tutor_subjects = Table(
    "tutor_subjects",
    Base.metadata,
    Column(
        "tutor_profile_id",
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "subject_id",
        ForeignKey("subjects.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)

tutor_levels = Table(
    "tutor_levels",
    Base.metadata,
    Column(
        "tutor_profile_id",
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "level_id",
        ForeignKey("levels.id", ondelete="CASCADE"),
        primary_key=True,
    ),
)


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"
    __table_args__ = (
        CheckConstraint(
            "teaching_mode IN ('online', 'offline', 'both')",
            name="ck_tutor_profiles_teaching_mode",
        ),
        CheckConstraint(
            "status IN ('draft', 'pending', 'approved', 'rejected')",
            name="ck_tutor_profiles_status",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True
    )
    location_id: Mapped[int | None] = mapped_column(
        ForeignKey("locations.id", ondelete="SET NULL"), index=True
    )
    title: Mapped[str] = mapped_column(String(255))
    bio: Mapped[str] = mapped_column(Text)
    experience_years: Mapped[int] = mapped_column(Integer, default=0)
    price_per_hour: Mapped[int] = mapped_column(Integer, default=0)
    teaching_mode: Mapped[str] = mapped_column(String(20), default="online")
    verified: Mapped[bool] = mapped_column(Boolean, default=False, index=True)
    status: Mapped[str] = mapped_column(String(20), default="draft", index=True)
    rating: Mapped[float] = mapped_column(Float, default=0)
    review_count: Mapped[int] = mapped_column(Integer, default=0)
    completed_lessons: Mapped[int] = mapped_column(Integer, default=0)
    student_count: Mapped[int] = mapped_column(Integer, default=0)

    user: Mapped[User] = relationship(back_populates="tutor_profile")
    location: Mapped[Location | None] = relationship(back_populates="tutors")
    subjects: Mapped[list[Subject]] = relationship(
        secondary=tutor_subjects, back_populates="tutors"
    )
    levels: Mapped[list[Level]] = relationship(
        secondary=tutor_levels, back_populates="tutors"
    )
    educations: Mapped[list[TutorEducation]] = relationship(
        back_populates="tutor_profile",
        cascade="all, delete-orphan",
        order_by="TutorEducation.id",
    )
    certificates: Mapped[list[TutorCertificate]] = relationship(
        back_populates="tutor_profile",
        cascade="all, delete-orphan",
        order_by="TutorCertificate.id",
    )
    availabilities: Mapped[list[TutorAvailability]] = relationship(
        back_populates="tutor_profile",
        cascade="all, delete-orphan",
        order_by="TutorAvailability.id",
    )
    reviews: Mapped[list[Review]] = relationship(
        back_populates="tutor_profile",
        cascade="all, delete-orphan",
    )


class TutorEducation(Base):
    __tablename__ = "tutor_educations"

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_profile_id: Mapped[int] = mapped_column(
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"), index=True
    )
    degree: Mapped[str] = mapped_column(String(120))
    major: Mapped[str] = mapped_column(String(255))
    school: Mapped[str] = mapped_column(String(255))
    year: Mapped[int | None] = mapped_column(Integer)

    tutor_profile: Mapped[TutorProfile] = relationship(back_populates="educations")


class TutorCertificate(Base):
    __tablename__ = "tutor_certificates"

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_profile_id: Mapped[int] = mapped_column(
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(255))
    file_url: Mapped[str | None] = mapped_column(String(500))

    tutor_profile: Mapped[TutorProfile] = relationship(back_populates="certificates")


class TutorAvailability(Base):
    __tablename__ = "tutor_availabilities"
    __table_args__ = (
        UniqueConstraint(
            "tutor_profile_id",
            "day_of_week",
            "start_time",
            "end_time",
            name="uq_tutor_availability_slot",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    tutor_profile_id: Mapped[int] = mapped_column(
        ForeignKey("tutor_profiles.id", ondelete="CASCADE"), index=True
    )
    day_of_week: Mapped[str] = mapped_column(String(10))
    start_time: Mapped[time] = mapped_column()
    end_time: Mapped[time] = mapped_column()

    tutor_profile: Mapped[TutorProfile] = relationship(back_populates="availabilities")
