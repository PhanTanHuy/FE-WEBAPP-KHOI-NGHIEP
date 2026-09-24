import json
import re
import unicodedata
from datetime import datetime, time, timezone
from pathlib import Path

from sqlalchemy import select

from app.database import SessionLocal
from app.models import (
    Level,
    Location,
    Review,
    Subject,
    TutorAvailability,
    TutorCertificate,
    TutorEducation,
    TutorProfile,
    User,
)

DATA_FILE = Path(__file__).with_name("mock_data.json")


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFD", value.replace("Đ", "D").replace("đ", "d"))
    ascii_value = "".join(
        character for character in normalized if unicodedata.category(character) != "Mn"
    )
    return re.sub(r"[^a-z0-9]+", "-", ascii_value.lower()).strip("-")


def parse_time_range(value: str) -> tuple[time, time]:
    start, end = value.split("-", maxsplit=1)
    return time.fromisoformat(start), time.fromisoformat(end)


def load_data() -> dict[str, list[dict[str, object]]]:
    return json.loads(DATA_FILE.read_text(encoding="utf-8"))


def seed() -> None:
    data = load_data()
    with SessionLocal.begin() as db:
        if db.scalar(select(TutorProfile.id).limit(1)) is not None:
            print("Seed skipped: tutor data already exists.")
            return

        subjects_by_name: dict[str, Subject] = {}
        for item in data["subjects"]:
            subject = Subject(
                slug=item["id"],
                name=item["name"],
                icon=item.get("icon"),
                color=item.get("color"),
            )
            db.add(subject)
            subjects_by_name[subject.name] = subject

        levels_by_name: dict[str, Level] = {}
        for item in data["levels"]:
            level = Level(
                slug=item["id"],
                name=item["name"],
                grades=item.get("grades"),
            )
            db.add(level)
            levels_by_name[level.name] = level

        locations_by_key: dict[tuple[str, str], Location] = {}
        for tutor in data["tutors"]:
            key = (tutor["city"], tutor["district"])
            if key in locations_by_key:
                continue
            location = Location(
                slug=f"{slugify(key[0])}-{slugify(key[1])}",
                city=key[0],
                district=key[1],
            )
            db.add(location)
            locations_by_key[key] = location

        db.flush()

        for index, item in enumerate(data["tutors"], start=1):
            user = User(
                email=f"tutor{index}@educonnect.local",
                full_name=item["name"],
                phone=None,
                password_hash="",
                role="tutor",
                avatar_url=item.get("avatar"),
            )
            db.add(user)
            db.flush()

            modes = item["teachingMode"]
            profile = TutorProfile(
                user_id=user.id,
                location=locations_by_key[(item["city"], item["district"])],
                title=item["title"],
                bio=item["bio"],
                experience_years=item["experience"],
                price_per_hour=item["pricePerHour"],
                teaching_mode="both" if len(modes) > 1 else modes[0],
                verified=item["verified"],
                status="approved",
                rating=item["rating"],
                review_count=item["reviewCount"],
                completed_lessons=item["completedLessons"],
                student_count=item["studentCount"],
                subjects=[subjects_by_name[name] for name in item["subjects"]],
                levels=[levels_by_name[name] for name in item["levels"]],
            )
            db.add(profile)
            db.flush()

            for education in item.get("education", []):
                db.add(
                    TutorEducation(
                        tutor_profile_id=profile.id,
                        degree=education["degree"],
                        major=education["major"],
                        school=education["school"],
                        year=education.get("year"),
                    )
                )

            for certificate in item.get("certifications", []):
                db.add(
                    TutorCertificate(
                        tutor_profile_id=profile.id,
                        name=certificate,
                        file_url=None,
                    )
                )

            for day, slots in item.get("schedule", {}).items():
                for slot in slots:
                    start_time, end_time = parse_time_range(slot)
                    db.add(
                        TutorAvailability(
                            tutor_profile_id=profile.id,
                            day_of_week=day,
                            start_time=start_time,
                            end_time=end_time,
                        )
                    )

            for review_index, review in enumerate(item.get("reviews", []), start=1):
                reviewer = User(
                    email=f"reviewer-{index}-{review_index}@educonnect.local",
                    full_name=review["studentName"],
                    password_hash="",
                    role="student",
                    avatar_url=review.get("avatar"),
                )
                db.add(reviewer)
                db.flush()
                review_date = datetime.fromisoformat(review["date"]).replace(
                    tzinfo=timezone.utc
                )
                db.add(
                    Review(
                        tutor_profile_id=profile.id,
                        user_id=reviewer.id,
                        booking_id=None,
                        rating=review["rating"],
                        comment=review["comment"],
                        created_at=review_date,
                    )
                )

    print("Seed complete: subjects, levels, locations and tutors inserted.")


if __name__ == "__main__":
    seed()
