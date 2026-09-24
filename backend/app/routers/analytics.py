"""
Analytics Router
----------------
Hai nhóm endpoints:

1. /analytics/event  (POST) — Frontend gửi sự kiện lên đây
   - Bất kỳ ai cũng gọi được (không cần login)
   - Rate-limit nhẹ để tránh spam
   
2. /analytics/stats/* (GET)  — Admin xem thống kê
   - Yêu cầu role=admin
"""
import json
from collections import defaultdict
from datetime import datetime, timedelta
from typing import Optional, List

from fastapi import APIRouter, Depends, Request, HTTPException
from pydantic import BaseModel
from sqlalchemy import func, desc
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import AnalyticsEvent, User
from app.api.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])


# ─── Schemas ───────────────────────────────────────────────────────────────────

class EventIn(BaseModel):
    """Payload từ frontend gửi lên mỗi khi user tương tác."""
    event_type: str          # 'view_tutor' | 'click_material' | 'search' | 'book' | 'view_page'
    entity_type: Optional[str] = None  # 'tutor' | 'material' | 'subject' | 'page'
    entity_id: Optional[int] = None
    entity_name: Optional[str] = None  # tên người đọc được
    meta: Optional[dict] = None        # {"subject": "Toán", "grade": "Lớp 10", "query": "..."}
    session_id: Optional[str] = None   # UUID từ localStorage

class EventOut(BaseModel):
    id: int
    event_type: str
    entity_type: Optional[str]
    entity_id: Optional[int]
    entity_name: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Helpers ───────────────────────────────────────────────────────────────────

def _require_admin(db: Session, current_user: User):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")


# ─── Ingest ────────────────────────────────────────────────────────────────────

@router.post("/event", status_code=201)
def track_event(
    payload: EventIn,
    request: Request,
    db: Session = Depends(get_db),
    # user không bắt buộc phải login
):
    """
    Frontend gọi endpoint này mỗi khi người dùng:
    - Xem trang gia sư
    - Click vào tài liệu
    - Tìm kiếm
    - Đặt lịch, v.v.
    """
    # Cố lấy user_id nếu có token (không bắt buộc)
    user_id = None
    try:
        from app.core.security import decode_access_token
        token = request.headers.get("Authorization", "").replace("Bearer ", "")
        if token:
            payload_jwt = decode_access_token(token)
            if payload_jwt:
                user_id = payload_jwt.get("sub")
    except Exception:
        pass

    event = AnalyticsEvent(
        user_id=user_id,
        session_id=payload.session_id,
        event_type=payload.event_type,
        entity_type=payload.entity_type,
        entity_id=payload.entity_id,
        entity_name=payload.entity_name,
        meta=json.dumps(payload.meta) if payload.meta else None,
        referrer=request.headers.get("Referer"),
        user_agent=request.headers.get("User-Agent", "")[:500],
        ip_address=request.client.host if request.client else None,
    )
    db.add(event)
    db.commit()
    return {"ok": True, "id": event.id}


# ─── Stats (Admin) ─────────────────────────────────────────────────────────────

@router.get("/stats/overview")
def stats_overview(
    days: int = 7,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tổng quan: số events theo ngày, theo loại."""
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    # Tổng events
    total = db.query(func.count(AnalyticsEvent.id)).filter(
        AnalyticsEvent.created_at >= since
    ).scalar()

    # Unique sessions (= ước lượng số lượt ghé thăm)
    unique_sessions = db.query(func.count(func.distinct(AnalyticsEvent.session_id))).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.session_id.isnot(None)
    ).scalar()

    # Events theo loại
    by_type = db.query(
        AnalyticsEvent.event_type,
        func.count(AnalyticsEvent.id).label("count")
    ).filter(
        AnalyticsEvent.created_at >= since
    ).group_by(AnalyticsEvent.event_type).order_by(desc("count")).all()

    # Events theo ngày (cho biểu đồ đường)
    daily_raw = db.query(
        func.date(AnalyticsEvent.created_at).label("day"),
        func.count(AnalyticsEvent.id).label("count")
    ).filter(
        AnalyticsEvent.created_at >= since
    ).group_by("day").order_by("day").all()

    return {
        "period_days": days,
        "total_events": total,
        "unique_sessions": unique_sessions,
        "by_event_type": [{"event_type": r.event_type, "count": r.count} for r in by_type],
        "daily": [{"day": str(r.day), "count": r.count} for r in daily_raw],
    }


@router.get("/stats/top-tutors")
def stats_top_tutors(
    days: int = 30,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Gia sư nào được xem/click nhiều nhất."""
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    rows = db.query(
        AnalyticsEvent.entity_id,
        AnalyticsEvent.entity_name,
        func.count(AnalyticsEvent.id).label("views")
    ).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.event_type.in_(["view_tutor", "click_tutor"]),
        AnalyticsEvent.entity_type == "tutor"
    ).group_by(
        AnalyticsEvent.entity_id,
        AnalyticsEvent.entity_name,
    ).order_by(desc("views")).limit(limit).all()

    return [{"tutor_id": r.entity_id, "name": r.entity_name, "views": r.views} for r in rows]


@router.get("/stats/top-materials")
def stats_top_materials(
    days: int = 30,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Tài liệu nào được xem/tải nhiều nhất."""
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    rows = db.query(
        AnalyticsEvent.entity_id,
        AnalyticsEvent.entity_name,
        AnalyticsEvent.event_type,
        func.count(AnalyticsEvent.id).label("count")
    ).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.event_type.in_(["view_material", "download_material", "click_material"]),
        AnalyticsEvent.entity_type == "material"
    ).group_by(
        AnalyticsEvent.entity_id,
        AnalyticsEvent.entity_name,
        AnalyticsEvent.event_type,
    ).order_by(desc("count")).limit(limit * 3).all()

    # Gom lại theo entity_id
    agg: dict = {}
    for r in rows:
        key = r.entity_id
        if key not in agg:
            agg[key] = {"material_id": r.entity_id, "name": r.entity_name, "views": 0, "downloads": 0}
        if r.event_type in ("view_material", "click_material"):
            agg[key]["views"] += r.count
        elif r.event_type == "download_material":
            agg[key]["downloads"] += r.count

    result = sorted(agg.values(), key=lambda x: x["views"] + x["downloads"] * 3, reverse=True)
    return result[:limit]


@router.get("/stats/top-subjects")
def stats_top_subjects(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Môn học nào được quan tâm nhiều nhất (từ meta field)."""
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    events = db.query(AnalyticsEvent.meta).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.meta.isnot(None)
    ).all()

    subject_counts: dict = defaultdict(int)
    for row in events:
        try:
            data = json.loads(row.meta)
            subj = data.get("subject")
            if subj:
                subject_counts[subj] += 1
        except Exception:
            pass

    ranked = sorted(subject_counts.items(), key=lambda x: x[1], reverse=True)
    return [{"subject": s, "count": c} for s, c in ranked[:15]]


@router.get("/stats/search-terms")
def stats_search_terms(
    days: int = 14,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Từ khóa tìm kiếm phổ biến nhất."""
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    events = db.query(AnalyticsEvent.meta).filter(
        AnalyticsEvent.created_at >= since,
        AnalyticsEvent.event_type == "search",
        AnalyticsEvent.meta.isnot(None)
    ).all()

    term_counts: dict = defaultdict(int)
    for row in events:
        try:
            data = json.loads(row.meta)
            q = data.get("query", "").strip().lower()
            if q:
                term_counts[q] += 1
        except Exception:
            pass

    ranked = sorted(term_counts.items(), key=lambda x: x[1], reverse=True)
    return [{"query": q, "count": c} for q, c in ranked[:limit]]


@router.get("/stats/funnel")
def stats_funnel(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Funnel chuyển đổi:
    view_page → view_tutor → book_tutor → (booking confirmed)
    """
    _require_admin(db, current_user)

    since = datetime.utcnow() - timedelta(days=days)

    steps = ["view_page", "view_tutor", "book_tutor", "download_material"]
    result = []
    for step in steps:
        count = db.query(func.count(AnalyticsEvent.id)).filter(
            AnalyticsEvent.created_at >= since,
            AnalyticsEvent.event_type == step
        ).scalar()
        result.append({"step": step, "count": count})

    return result
