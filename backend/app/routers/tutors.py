import math
from datetime import time
from typing import List, Optional, Dict, Union, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, or_

from app.database import get_db
from app.api.deps import get_current_user
from app.models.models import (
    TutorProfile, Subject, Level, Location, User,
    TutorAvailability
)
from app.schemas.tutor import (
    TutorListItem, TutorDetail, TutorPaginationResponse,
    AvailabilityResponse, AvailabilityUpdateInput
)

router = APIRouter(prefix="/tutors", tags=["Tutors"])

def format_tutor_list_item(t: TutorProfile) -> dict:
    mode = ["online", "offline"] if t.teaching_mode == "both" else [t.teaching_mode]
    loc_str = f"{t.location.city} - {t.location.district}" if t.location else "Toàn quốc"
    
    return {
        "id": t.id,
        "name": t.user.full_name if t.user else "Gia sư",
        "avatar": t.user.avatar_url if t.user else None,
        "title": t.title,
        "subjects": [s.name for s in t.subjects],
        "levels": [l.name for l in t.levels],
        "rating": t.rating,
        "reviewCount": t.review_count,
        "pricePerHour": t.price_per_hour,
        "location": loc_str,
        "district": t.location.district if t.location else None,
        "city": t.location.city if t.location else None,
        "teachingMode": mode,
        "verified": t.verified,
        "experience": t.experience_years,
        "bio": t.bio,
        "completedLessons": t.completed_lessons,
        "studentCount": t.student_count
    }


@router.get("", response_model=Union[TutorPaginationResponse, List[TutorListItem]])
def get_tutors(
    q: Optional[str] = Query(None, description="Từ khóa tìm kiếm (tên, tiêu đề, môn dạy...)"),
    subject: Optional[str] = Query(None, description="Môn học (slug hoặc tên)"),
    level: Optional[str] = Query(None, description="Cấp học (slug hoặc tên)"),
    city: Optional[str] = Query(None, description="Thành phố"),
    district: Optional[str] = Query(None, description="Quận/Huyện"),
    mode: Optional[str] = Query(None, description="online, offline, both, all"),
    min_price: Optional[int] = Query(None, description="Học phí tối thiểu"),
    max_price: Optional[int] = Query(None, description="Học phí tối đa"),
    verified: Optional[bool] = Query(None, description="Chỉ gia sư đã xác thực"),
    sort: Optional[str] = Query("rating_desc", description="rating_desc, price_asc, price_desc, experience_desc, reviews_desc"),
    page: int = Query(1, ge=1, description="Số trang hiện tại"),
    per_page: int = Query(12, ge=1, le=100, description="Số lượng mục mỗi trang"),
    paginate: bool = Query(True, description="Trả về đối tượng phân trang hay mảng"),
    db: Session = Depends(get_db)
):
    """
    Tìm kiếm, lọc nâng cao và phân trang gia sư.
    """
    query = (
        db.query(TutorProfile)
        .join(TutorProfile.user)
        .options(
            joinedload(TutorProfile.user),
            joinedload(TutorProfile.location),
            joinedload(TutorProfile.subjects),
            joinedload(TutorProfile.levels)
        )
        .filter(TutorProfile.status == "approved")
    )

    # 1. Tìm kiếm Full-text (hỗ trợ tiếng Việt không dấu qua unaccent)
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                func.unaccent(User.full_name).ilike(func.unaccent(term)),
                func.unaccent(TutorProfile.title).ilike(func.unaccent(term)),
                func.unaccent(TutorProfile.bio).ilike(func.unaccent(term)),
                TutorProfile.subjects.any(func.unaccent(Subject.name).ilike(func.unaccent(term)))
            )
        )

    # 2. Lọc theo môn học
    if subject and subject.strip() and subject != "all":
        sub_term = subject.strip()
        query = query.filter(
            TutorProfile.subjects.any(
                or_(
                    Subject.slug.ilike(sub_term),
                    Subject.name.ilike(sub_term),
                    func.unaccent(Subject.name).ilike(func.unaccent(f"%{sub_term}%"))
                )
            )
        )

    # 3. Lọc theo cấp học
    if level and level.strip() and level != "all":
        lvl_term = level.strip()
        query = query.filter(
            TutorProfile.levels.any(
                or_(
                    Level.slug.ilike(lvl_term),
                    Level.name.ilike(lvl_term),
                    func.unaccent(Level.name).ilike(func.unaccent(f"%{lvl_term}%"))
                )
            )
        )

    # 4. Lọc theo thành phố
    if city and city.strip() and city != "all":
        city_term = city.strip()
        query = query.filter(
            TutorProfile.location.has(
                or_(
                    Location.city.ilike(f"%{city_term}%"),
                    Location.slug.ilike(f"%{city_term}%"),
                    func.unaccent(Location.city).ilike(func.unaccent(f"%{city_term}%"))
                )
            )
        )

    # 5. Lọc theo quận/huyện
    if district and district.strip() and district != "all":
        query = query.filter(
            TutorProfile.location.has(
                Location.district.ilike(f"%{district.strip()}%")
            )
        )

    # 6. Lọc theo hình thức dạy (online/offline)
    if mode and mode != "all":
        if mode == "online":
            query = query.filter(TutorProfile.teaching_mode.in_(["online", "both"]))
        elif mode == "offline":
            query = query.filter(TutorProfile.teaching_mode.in_(["offline", "both"]))
        elif mode == "both":
            query = query.filter(TutorProfile.teaching_mode == "both")

    # 7. Lọc theo khoảng giá
    if min_price is not None:
        query = query.filter(TutorProfile.price_per_hour >= min_price)
    if max_price is not None:
        query = query.filter(TutorProfile.price_per_hour <= max_price)

    # 8. Lọc gia sư đã xác thực
    if verified is True:
        query = query.filter(TutorProfile.verified == True)

    # 9. Sắp xếp kết quả
    if sort in ("rating_desc", "rating"):
        query = query.order_by(TutorProfile.rating.desc(), TutorProfile.review_count.desc())
    elif sort == "price_asc":
        query = query.order_by(TutorProfile.price_per_hour.asc())
    elif sort == "price_desc":
        query = query.order_by(TutorProfile.price_per_hour.desc())
    elif sort in ("experience_desc", "experience"):
        query = query.order_by(TutorProfile.experience_years.desc())
    elif sort in ("reviews_desc", "reviews"):
        query = query.order_by(TutorProfile.review_count.desc())
    else:
        query = query.order_by(TutorProfile.id.desc())

    total = query.count()

    if not paginate:
        tutors = query.all()
        return [format_tutor_list_item(t) for t in tutors]

    total_pages = math.ceil(total / per_page) if per_page > 0 else 1
    offset = (page - 1) * per_page
    tutors = query.offset(offset).limit(per_page).all()

    return {
        "items": [format_tutor_list_item(t) for t in tutors],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": total_pages
    }


# -------------------------------------------------------------
# AVAILABILITY ENDPOINTS
# -------------------------------------------------------------
@router.put("/me/availability", response_model=AvailabilityResponse)
def update_my_availability(
    body: AvailabilityUpdateInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Gia sư cập nhật lịch rảnh của mình.
    """
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bạn chưa có hồ sơ gia sư."
        )

    # Clear old availability slots
    db.query(TutorAvailability).filter(TutorAvailability.tutor_profile_id == profile.id).delete()

    # Parse and insert new slots
    for day, slots in body.schedule.items():
        for slot_str in slots:
            if "-" not in slot_str:
                continue
            parts = slot_str.split("-")
            try:
                sh, sm = map(int, parts[0].strip().split(":"))
                eh, em = map(int, parts[1].strip().split(":"))
                start_t = time(sh, sm)
                end_t = time(eh, em)

                avail = TutorAvailability(
                    tutor_profile_id=profile.id,
                    day_of_week=day,
                    start_time=start_t,
                    end_time=end_t
                )
                db.add(avail)
            except Exception as e:
                continue

    db.commit()

    # Re-query
    profile_avails = db.query(TutorAvailability).filter(TutorAvailability.tutor_profile_id == profile.id).all()
    schedule: Dict[str, List[str]] = {}
    for a in profile_avails:
        slot = f"{a.start_time.strftime('%H:%M')}-{a.end_time.strftime('%H:%M')}"
        if a.day_of_week not in schedule:
            schedule[a.day_of_week] = []
        schedule[a.day_of_week].append(slot)

    return {
        "tutorId": profile.id,
        "schedule": schedule
    }


@router.get("/{id}/availability", response_model=AvailabilityResponse)
def get_tutor_availability(id: int, db: Session = Depends(get_db)):
    """
    Lấy lịch rảnh của 1 gia sư theo ID.
    """
    tutor = db.query(TutorProfile).filter(TutorProfile.id == id).first()
    if not tutor:
        raise HTTPException(status_code=404, detail="Không tìm thấy gia sư")

    avails = db.query(TutorAvailability).filter(TutorAvailability.tutor_profile_id == id).all()
    schedule: Dict[str, List[str]] = {}
    for a in avails:
        slot = f"{a.start_time.strftime('%H:%M')}-{a.end_time.strftime('%H:%M')}"
        if a.day_of_week not in schedule:
            schedule[a.day_of_week] = []
        schedule[a.day_of_week].append(slot)

    return {
        "tutorId": id,
        "schedule": schedule
    }


# -------------------------------------------------------------
# TUTOR DETAIL
# -------------------------------------------------------------
@router.get("/{id}", response_model=TutorDetail)
def get_tutor_by_id(id: int, db: Session = Depends(get_db)):
    """
    Lấy thông tin chi tiết của 1 gia sư theo ID.
    """
    tutor = (
        db.query(TutorProfile)
        .options(
            joinedload(TutorProfile.user),
            joinedload(TutorProfile.location),
            joinedload(TutorProfile.subjects),
            joinedload(TutorProfile.levels),
            joinedload(TutorProfile.educations),
            joinedload(TutorProfile.certificates),
            joinedload(TutorProfile.availabilities),
            joinedload(TutorProfile.reviews)
        )
        .filter(TutorProfile.id == id)
        .first()
    )

    if not tutor:
        raise HTTPException(status_code=404, detail="Không tìm thấy thông tin gia sư")

    base_data = format_tutor_list_item(tutor)

    # Format education
    educations = [
        {
            "degree": e.degree,
            "major": e.major,
            "school": e.school,
            "year": e.year
        }
        for e in tutor.educations
    ]

    # Format certifications
    certifications = [c.name for c in tutor.certificates]

    # Format schedule
    schedule: Dict[str, List[str]] = {}
    for avail in tutor.availabilities:
        slot_str = f"{avail.start_time.strftime('%H:%M')}-{avail.end_time.strftime('%H:%M')}"
        if avail.day_of_week not in schedule:
            schedule[avail.day_of_week] = []
        schedule[avail.day_of_week].append(slot_str)

    # Format reviews
    reviews = []
    for r in tutor.reviews:
        student_name = r.user.full_name if r.user else "Học sinh"
        avatar = r.user.avatar_url if (r.user and r.user.avatar_url) else "https://i.pravatar.cc/150?img=12"
        reviews.append({
            "id": r.id,
            "studentName": student_name,
            "rating": r.rating,
            "comment": r.comment,
            "date": r.created_at.strftime("%Y-%m-%d") if r.created_at else "2024-10-01",
            "avatar": avatar
        })

    return {
        **base_data,
        "education": educations,
        "certifications": certifications,
        "schedule": schedule,
        "reviews": reviews
    }
