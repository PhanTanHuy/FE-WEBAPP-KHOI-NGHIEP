import os
import uuid
import io
from pathlib import Path
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session, joinedload
from PIL import Image

from app.api.deps import get_db, get_current_user, get_current_admin
from app.models.models import (
    User, TutorProfile, Subject, Level, Location,
    TutorEducation, TutorCertificate
)
from app.schemas.tutor_application import (
    TutorApplicationInput, TutorApplicationResponse, AdminRejectInput
)

router = APIRouter(tags=["Tutor Applications"])

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "avatars").mkdir(parents=True, exist_ok=True)
(UPLOAD_DIR / "documents").mkdir(parents=True, exist_ok=True)

def tutor_profile_to_response(profile: TutorProfile) -> TutorApplicationResponse:
    user = profile.user
    location = profile.location
    educations = profile.educations or []
    certificates = profile.certificates or []
    subjects = profile.subjects or []
    levels = profile.levels or []

    primary_edu = educations[0] if educations else None
    primary_cert = certificates[0] if certificates else None

    return TutorApplicationResponse(
        id=profile.id,
        userId=profile.user_id,
        fullName=user.full_name if user else "",
        phone=user.phone if user else None,
        email=user.email if user else "",
        birthday=user.birthday if user else None,
        address=user.address if user else None,
        introduction=profile.bio or "",
        avatar=user.avatar_url if user else None,
        title=profile.title or "Gia sư EduConnect",
        educationLevel=primary_edu.degree if primary_edu else None,
        major=primary_edu.major if primary_edu else None,
        school=primary_edu.school if primary_edu else None,
        year=primary_edu.year if primary_edu else None,
        certificates=[c.name for c in certificates],
        certificateFile=primary_cert.file_url if primary_cert else None,
        subjects=[s.name for s in subjects],
        grades=[l.name for l in levels],
        districts=[location.district] if location and location.district else [],
        city=location.city if location else None,
        minPrice=profile.price_per_hour or 100000,
        maxPrice=profile.price_per_hour or 500000,
        teachingMode=profile.teaching_mode or "both",
        status=profile.status or "draft",
        verified=profile.verified or False,
        rejectionReason=profile.rejection_reason
    )


# -------------------------------------------------------------
# FILE UPLOAD
# -------------------------------------------------------------
@router.post("/uploads", summary="Tải lên hình ảnh hoặc tài liệu chứng chỉ")
async def upload_file(
    file: UploadFile = File(...),
    type: str = Form("avatar")  # 'avatar' or 'document'
):
    contents = await file.read()
    if len(contents) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Dung lượng tệp không được vượt quá 10MB")

    ext = Path(file.filename or "file").suffix.lower()
    unique_name = f"{uuid.uuid4().hex}{ext}"

    if type == "avatar":
        allowed_img_exts = {".jpg", ".jpeg", ".png", ".webp"}
        if ext not in allowed_img_exts:
            raise HTTPException(status_code=400, detail="Ảnh đại diện phải có định dạng JPG, PNG hoặc WEBP")

        try:
            image = Image.open(io.BytesIO(contents))
            # Convert RGBA to RGB for JPEG
            if image.mode in ("RGBA", "P") and ext in {".jpg", ".jpeg"}:
                image = image.convert("RGB")
            
            # Resize if large
            image.thumbnail((1024, 1024))
            save_path = UPLOAD_DIR / "avatars" / unique_name
            image.save(save_path)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Không thể xử lý ảnh: {str(e)}")

        return {
            "url": f"/uploads/avatars/{unique_name}",
            "filename": file.filename
        }
    else:
        # Document / Certificate
        allowed_doc_exts = {".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"}
        if ext not in allowed_doc_exts:
            raise HTTPException(status_code=400, detail="Chứng chỉ phải là file PDF, DOC hoặc hình ảnh")

        save_path = UPLOAD_DIR / "documents" / unique_name
        with open(save_path, "wb") as f:
            f.write(contents)

        return {
            "url": f"/uploads/documents/{unique_name}",
            "filename": file.filename
        }


# -------------------------------------------------------------
# TUTOR APPLICATION (DRAFT, VIEW, SUBMIT)
# -------------------------------------------------------------
@router.get("/tutor-applications/me", response_model=Optional[TutorApplicationResponse])
def get_my_tutor_application(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = (
        db.query(TutorProfile)
        .options(
            joinedload(TutorProfile.user),
            joinedload(TutorProfile.location),
            joinedload(TutorProfile.subjects),
            joinedload(TutorProfile.levels),
            joinedload(TutorProfile.educations),
            joinedload(TutorProfile.certificates)
        )
        .filter(TutorProfile.user_id == current_user.id)
        .first()
    )
    if not profile:
        return None
    return tutor_profile_to_response(profile)


@router.post("/tutor-applications", response_model=TutorApplicationResponse)
def save_or_update_tutor_application(
    app_in: TutorApplicationInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Update basic User info
    if app_in.fullName:
        current_user.full_name = app_in.fullName
    if app_in.phone:
        current_user.phone = app_in.phone
    if app_in.birthday:
        current_user.birthday = app_in.birthday
    if app_in.address:
        current_user.address = app_in.address
    if app_in.avatar:
        current_user.avatar_url = app_in.avatar

    # 2. Get or create TutorProfile
    profile = db.query(TutorProfile).filter(TutorProfile.user_id == current_user.id).first()
    if not profile:
        profile = TutorProfile(
            user_id=current_user.id,
            title=app_in.title or f"Gia sư {app_in.fullName or current_user.full_name}",
            bio=app_in.introduction or "",
            price_per_hour=app_in.minPrice or 150000,
            teaching_mode=app_in.teachingMode or "both",
            status="draft",
            verified=False
        )
        db.add(profile)
        db.flush()
    else:
        if app_in.title:
            profile.title = app_in.title
        elif not profile.title:
            profile.title = f"Gia sư {app_in.fullName or current_user.full_name}"
        if app_in.introduction is not None:
            profile.bio = app_in.introduction
        if app_in.minPrice:
            profile.price_per_hour = app_in.minPrice
        if app_in.teachingMode:
            profile.teaching_mode = app_in.teachingMode

    # 3. Update Location if districts or city provided
    district = app_in.districts[0] if app_in.districts and app_in.districts[0] else None
    city = app_in.city or "Hà Nội"
    if district:
        loc = db.query(Location).filter(
            Location.city.ilike(city),
            Location.district.ilike(district)
        ).first()
        if not loc:
            slug = f"{city.lower().replace(' ', '-')}-{district.lower().replace(' ', '-')}"
            loc = Location(slug=slug, city=city, district=district)
            db.add(loc)
            db.flush()
        profile.location_id = loc.id

    # 4. Update Subjects
    if app_in.subjects:
        matched_subjects = []
        for s_name in app_in.subjects:
            sub = db.query(Subject).filter(Subject.name.ilike(s_name)).first()
            if not sub:
                slug = s_name.lower().replace(" ", "-")
                sub = Subject(name=s_name, slug=slug, color="#3B82F6")
                db.add(sub)
                db.flush()
            matched_subjects.append(sub)
        profile.subjects = matched_subjects

    # 5. Update Levels
    if app_in.grades:
        matched_levels = []
        for g_name in app_in.grades:
            lvl = db.query(Level).filter(Level.name.ilike(g_name)).first()
            if not lvl:
                slug = g_name.lower().replace(" ", "-")
                lvl = Level(name=g_name, slug=slug)
                db.add(lvl)
                db.flush()
            matched_levels.append(lvl)
        profile.levels = matched_levels

    # 6. Update Education
    if app_in.educationLevel or app_in.major or app_in.school:
        if profile.educations:
            edu = profile.educations[0]
            edu.degree = app_in.educationLevel or edu.degree or "Đại học"
            edu.major = app_in.major or edu.major or ""
            edu.school = app_in.school or edu.school or ""
            if app_in.year:
                edu.year = app_in.year
        else:
            edu = TutorEducation(
                tutor_profile_id=profile.id,
                degree=app_in.educationLevel or "Đại học",
                major=app_in.major or "",
                school=app_in.school or "",
                year=app_in.year
            )
            db.add(edu)

    # 7. Update Certificate
    if app_in.certificates or app_in.certificateFile:
        cert_name = ", ".join(app_in.certificates) if app_in.certificates else "Chứng chỉ giảng dạy"
        if profile.certificates:
            cert = profile.certificates[0]
            cert.name = cert_name
            if app_in.certificateFile:
                cert.file_url = app_in.certificateFile
        else:
            cert = TutorCertificate(
                tutor_profile_id=profile.id,
                name=cert_name,
                file_url=app_in.certificateFile
            )
            db.add(cert)

    db.commit()
    db.refresh(profile)
    return tutor_profile_to_response(profile)


@router.post("/tutor-applications/{id}/submit", response_model=TutorApplicationResponse)
def submit_tutor_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(TutorProfile).filter(
        TutorProfile.id == id,
        TutorProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ gia sư")

    # Transition to pending
    profile.status = "pending"
    profile.rejection_reason = None
    db.commit()
    db.refresh(profile)
    return tutor_profile_to_response(profile)


# -------------------------------------------------------------
# ADMIN APPROVAL ENDPOINTS
# -------------------------------------------------------------
@router.get("/admin/tutor-applications", response_model=List[TutorApplicationResponse])
def get_all_tutor_applications(
    status: Optional[str] = None,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    query = (
        db.query(TutorProfile)
        .options(
            joinedload(TutorProfile.user),
            joinedload(TutorProfile.location),
            joinedload(TutorProfile.subjects),
            joinedload(TutorProfile.levels),
            joinedload(TutorProfile.educations),
            joinedload(TutorProfile.certificates)
        )
    )
    if status and status != "all":
        query = query.filter(TutorProfile.status == status)

    applications = query.order_by(TutorProfile.id.desc()).all()
    return [tutor_profile_to_response(p) for p in applications]


@router.post("/admin/tutor-applications/{id}/approve", response_model=TutorApplicationResponse)
def approve_tutor_application(
    id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    profile = db.query(TutorProfile).filter(TutorProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    profile.status = "approved"
    profile.verified = True
    profile.rejection_reason = None
    if profile.user:
        profile.user.role = "tutor"

    db.commit()
    db.refresh(profile)
    return tutor_profile_to_response(profile)


@router.post("/admin/tutor-applications/{id}/reject", response_model=TutorApplicationResponse)
def reject_tutor_application(
    id: int,
    body: AdminRejectInput,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    profile = db.query(TutorProfile).filter(TutorProfile.id == id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Không tìm thấy hồ sơ")

    profile.status = "rejected"
    profile.verified = False
    profile.rejection_reason = body.reason or "Hồ sơ chưa đạt yêu cầu kiểm duyệt"

    db.commit()
    db.refresh(profile)
    return tutor_profile_to_response(profile)
