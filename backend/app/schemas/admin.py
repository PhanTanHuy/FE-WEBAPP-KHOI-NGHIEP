from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class AuditLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    action: str
    entity: str
    entity_id: Optional[int]
    details: Optional[str]
    ip_address: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class UserAdminOut(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class MaterialApprovalRequest(BaseModel):
    status: str # "approved" or "rejected"
    reason: Optional[str] = None
