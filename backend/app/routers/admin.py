from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import User, AuditLog, Material, Review, Booking, TutorProfile
from app.schemas.admin import AuditLogOut, UserAdminOut, MaterialApprovalRequest
from app.api.deps import get_current_user

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@router.get("/users", response_model=List[UserAdminOut])
def get_all_users(db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return users

@router.put("/users/{user_id}/role")
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = role
    db.commit()
    # Audit log
    audit = AuditLog(user_id=admin.id, action="update_role", entity="User", entity_id=user.id, details=f"Changed role to {role}")
    db.add(audit)
    db.commit()
    return {"status": "success"}

@router.get("/audit-logs", response_model=List[AuditLogOut])
def get_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()
    return logs

@router.put("/materials/{material_id}/approve")
def approve_material(material_id: int, req: MaterialApprovalRequest, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    material = db.query(Material).filter(Material.id == material_id).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    
    material.status = req.status
    db.commit()
    audit = AuditLog(user_id=admin.id, action="approve_material", entity="Material", entity_id=material.id, details=f"Status: {req.status}")
    db.add(audit)
    db.commit()
    return {"status": "success", "material_status": material.status}

@router.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), admin: User = Depends(require_admin)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
    audit = AuditLog(user_id=admin.id, action="delete_review", entity="Review", entity_id=review_id)
    db.add(audit)
    db.commit()
    return {"status": "success"}
