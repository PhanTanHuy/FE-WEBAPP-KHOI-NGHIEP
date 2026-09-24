import os
import math
import shutil
from pathlib import Path
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.api.deps import get_db, get_current_user, get_optional_current_user
from app.models.models import (
    Material, MaterialFavorite, MaterialDownload, User, Subject, Level
)
from app.schemas.material import (
    MaterialCreate, MaterialResponse, MaterialPaginatedResponse
)

router = APIRouter(prefix="/materials", tags=["materials"])

DOCUMENTS_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "documents"
DOCUMENTS_DIR.mkdir(parents=True, exist_ok=True)

def format_material(m: Material, current_user_id: Optional[int] = None) -> MaterialResponse:
    is_fav = False
    if current_user_id:
        is_fav = any(f.user_id == current_user_id for f in m.favorites)

    return MaterialResponse(
        id=m.id,
        title=m.title,
        description=m.description,
        subject_id=m.subject_id,
        level_id=m.level_id,
        grade=m.grade,
        type=m.type,
        file_format=m.file_format,
        is_premium=m.is_premium,
        price=m.price,
        tags=m.tags,
        pages=m.pages,
        file_size=m.file_size,
        file_url=m.file_url,
        author_id=m.author_id,
        status=m.status,
        downloads=m.downloads,
        created_at=m.created_at,
        subject_name=m.subject.name if m.subject else None,
        level_name=m.level.name if m.level else None,
        author_name=m.author.full_name if m.author else "EduConnect",
        is_favorite=is_fav
    )

@router.get("/", response_model=MaterialPaginatedResponse)
def get_materials(
    q: Optional[str] = None,
    subject: Optional[str] = None,
    level: Optional[str] = None,
    grade: Optional[str] = None,
    type: Optional[str] = None,
    file_format: Optional[str] = None,
    price: Optional[str] = None,
    sort: Optional[str] = "newest",
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Material).filter(Material.status == "approved")

    # 1. Tìm kiếm từ khóa
    if q and q.strip():
        term = f"%{q.strip()}%"
        query = query.filter(
            or_(
                Material.title.ilike(term),
                Material.description.ilike(term),
                Material.tags.ilike(term)
            )
        )

    # 2. Lọc theo môn học
    if subject and subject != "all":
        # Check by id, slug or name
        if subject.isdigit():
            query = query.filter(Material.subject_id == int(subject))
        else:
            query = query.join(Material.subject).filter(
                or_(Subject.slug == subject, Subject.name == subject)
            )

    # 3. Lọc theo cấp học / khối lớp
    if level and level != "all":
        if level.isdigit():
            query = query.filter(Material.level_id == int(level))
        else:
            query = query.join(Material.level).filter(
                or_(Level.slug == level, Level.name == level)
            )

    if grade and grade != "all":
        query = query.filter(Material.grade == grade)

    # 4. Lọc theo loại tài liệu (exam, material, exercise)
    if type and type != "all":
        query = query.filter(Material.type == type)

    # 5. Lọc theo định dạng file (PDF, DOC, ZIP)
    if file_format and file_format != "all":
        query = query.filter(Material.file_format.ilike(file_format))

    # 6. Lọc theo giá (Miễn phí / Trả phí)
    if price and price != "all":
        if price.lower() in ["free", "miễn phí"]:
            query = query.filter(Material.is_premium == False)
        elif price.lower() in ["premium", "trả phí"]:
            query = query.filter(Material.is_premium == True)

    # 7. Sắp xếp
    if sort == "downloads_desc":
        query = query.order_by(desc(Material.downloads))
    elif sort == "title_asc":
        query = query.order_by(asc(Material.title))
    elif sort == "oldest":
        query = query.order_by(asc(Material.created_at))
    else: # newest
        query = query.order_by(desc(Material.created_at))

    total = query.count()
    total_pages = math.ceil(total / per_page) if per_page > 0 else 1
    offset = (page - 1) * per_page
    materials = query.offset(offset).limit(per_page).all()

    current_user_id = current_user.id if current_user else None
    items = [format_material(m, current_user_id) for m in materials]

    return MaterialPaginatedResponse(
        items=items,
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages
    )

@router.get("/my-favorites", response_model=List[MaterialResponse])
def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favs = db.query(MaterialFavorite).filter(MaterialFavorite.user_id == current_user.id).all()
    materials = [f.material for f in favs if f.material and f.material.status == "approved"]
    return [format_material(m, current_user.id) for m in materials]

@router.get("/{id}", response_model=MaterialResponse)
def get_material_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    material = db.query(Material).filter(Material.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu này")
    
    current_user_id = current_user.id if current_user else None
    return format_material(material, current_user_id)

@router.post("/", response_model=MaterialResponse, status_code=status.HTTP_201_CREATED)
def create_material(
    material_in: MaterialCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_m = Material(
        title=material_in.title,
        description=material_in.description,
        subject_id=material_in.subject_id,
        level_id=material_in.level_id,
        grade=material_in.grade,
        type=material_in.type,
        file_format=material_in.file_format,
        author_id=current_user.id,
        status="approved", # auto-approve for seamless test
        is_premium=material_in.is_premium,
        price=material_in.price,
        tags=material_in.tags,
        pages=material_in.pages,
        file_size=material_in.file_size,
        file_url=material_in.file_url or "/uploads/documents/sample_document.pdf"
    )
    db.add(new_m)
    db.commit()
    db.refresh(new_m)
    return format_material(new_m, current_user.id)

@router.post("/upload-file")
async def upload_material_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Tải file tài liệu lên hệ thống (PDF, DOCX, ZIP...)
    """
    ext = Path(file.filename).suffix.lower()
    allowed_exts = [".pdf", ".doc", ".docx", ".zip", ".rar", ".pptx", ".xlsx"]
    if ext not in allowed_exts:
        raise HTTPException(
            status_code=400,
            detail=f"Định dạng file không được hỗ trợ ({ext}). Chỉ chấp nhận PDF, DOC, ZIP..."
        )

    safe_name = f"{int(datetime.utcnow().timestamp())}_{file.filename.replace(' ', '_')}"
    file_path = DOCUMENTS_DIR / safe_name

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size_bytes = os.path.getsize(file_path)
    file_size_mb = f"{round(file_size_bytes / (1024 * 1024), 1)} MB" if file_size_bytes >= 1024 * 1024 else f"{round(file_size_bytes / 1024)} KB"

    file_format = ext.replace(".", "").upper()

    return {
        "file_name": file.filename,
        "file_url": f"/uploads/documents/{safe_name}",
        "file_size": file_size_mb,
        "file_format": file_format
    }

@router.post("/{id}/favorite")
def toggle_favorite_material(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    material = db.query(Material).filter(Material.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu")

    fav = db.query(MaterialFavorite).filter(
        MaterialFavorite.material_id == id,
        MaterialFavorite.user_id == current_user.id
    ).first()

    if fav:
        db.delete(fav)
        db.commit()
        return {"is_favorite": False, "message": "Đã bỏ lưu tài liệu"}
    else:
        new_fav = MaterialFavorite(material_id=id, user_id=current_user.id)
        db.add(new_fav)
        db.commit()
        return {"is_favorite": True, "message": "Đã lưu tài liệu vào danh sách yêu thích"}

@router.post("/{id}/download")
def download_material(
    id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    material = db.query(Material).filter(Material.id == id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài liệu")

    # Increment download count
    material.downloads += 1

    # Record download log
    log = MaterialDownload(
        material_id=id,
        user_id=current_user.id if current_user else None
    )
    db.add(log)
    db.commit()

    return {
        "download_url": material.file_url or "/uploads/documents/sample_document.pdf",
        "downloads": material.downloads,
        "message": "Đang tải xuống tài liệu..."
    }
