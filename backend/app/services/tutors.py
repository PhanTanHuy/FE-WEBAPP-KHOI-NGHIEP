from collections import defaultdict
from math import ceil

from sqlalchemy import func, select
from sqlalchemy.orm import Session, selectinload

from app.models import Review, TutorProfile
from app.schemas.tutor import PaginatedTutors, TutorDetail, TutorSummary


TUTOR_LOAD_OPTIONS = (
    selectinload(TutorProfile.user),
    selectinload(TutorProfile.location),
    selectinload(TutorProfile.subjects),
    selectinload(TutorProfile.levels),
    selectinload(TutorProfile.educations),
    selectinload(TutorProfile.certificates),
    selectinload(TutorProfile.availabilities),
    selectinload(TutorProfile.reviews).selectinload(Review.user),
)


def teaching_modes(value: str) -> list[str]:
    return ["online", "offline"] if value == "both" else [value]


def summary_payload(tutor: TutorProfile) -> dict[str, object]:
    location = tutor.location
    city = location.city if location else ""
    district = location.district if location else ""

    return {
        "id": tutor.id,
        "name": tutor.user.full_name,
        "avatar": tutor.user.avatar_url,
        "title": tutor.title,
        "subjects": [subject.name for subject in tutor.subjects],
        "levels": [level.name for level in tutor.levels],
        "rating": tutor.rating,
        "review_count": tutor.review_count,
        "price_per_hour": tutor.price_per_hour,
        "location": " - ".join(part for part in (city, district) if part),
        "district": district,
        "city": city,
        "teaching_mode": teaching_modes(tutor.teaching_mode),
        "verified": tutor.verified,
        "experience": tutor.experience_years,
        "bio": tutor.bio,
        "completed_lessons": tutor.completed_lessons,
        "student_count": tutor.student_count,
    }


def list_tutors(
    db: Session,
    *,
    page: int,
    per_page: int,
) -> PaginatedTutors:
    base_query = select(TutorProfile).where(TutorProfile.status == "approved")
    total = db.scalar(
        select(func.count()).select_from(base_query.subquery())
    ) or 0
    tutors = db.scalars(
        base_query.options(*TUTOR_LOAD_OPTIONS)
        .order_by(TutorProfile.id)
        .offset((page - 1) * per_page)
        .limit(per_page)
    ).all()

    return PaginatedTutors(
        items=[TutorSummary.model_validate(summary_payload(tutor)) for tutor in tutors],
        page=page,
        per_page=per_page,
        total=total,
        total_pages=ceil(total / per_page) if total else 0,
    )


def get_tutor(db: Session, tutor_id: int) -> TutorDetail | None:
    tutor = db.scalar(
        select(TutorProfile)
        .where(TutorProfile.id == tutor_id, TutorProfile.status == "approved")
        .options(*TUTOR_LOAD_OPTIONS)
    )
    if tutor is None:
        return None

    schedule: dict[str, list[str]] = defaultdict(list)
    for slot in tutor.availabilities:
        schedule[slot.day_of_week].append(
            f"{slot.start_time.strftime('%H:%M')}-{slot.end_time.strftime('%H:%M')}"
        )

    reviews = sorted(tutor.reviews, key=lambda review: review.created_at, reverse=True)
    payload = {
        **summary_payload(tutor),
        "education": [
            {
                "degree": education.degree,
                "major": education.major,
                "school": education.school,
                "year": education.year,
            }
            for education in tutor.educations
        ],
        "certifications": [certificate.name for certificate in tutor.certificates],
        "schedule": dict(schedule),
        "reviews": [
            {
                "id": review.id,
                "student_name": review.user.full_name if review.user else "Ẩn danh",
                "rating": review.rating,
                "comment": review.comment,
                "date": review.created_at.date(),
                "avatar": review.user.avatar_url if review.user else None,
            }
            for review in reviews
        ],
    }
    return TutorDetail.model_validate(payload)
