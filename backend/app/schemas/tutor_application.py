from pydantic import BaseModel, Field
from typing import Optional, List, Dict

class TutorApplicationInput(BaseModel):
    fullName: Optional[str] = None
    phone: Optional[str] = None
    birthday: Optional[str] = None
    address: Optional[str] = None
    introduction: Optional[str] = None
    avatar: Optional[str] = None
    title: Optional[str] = None
    educationLevel: Optional[str] = None
    major: Optional[str] = None
    school: Optional[str] = None
    year: Optional[int] = None
    certificates: Optional[List[str]] = []
    certificateFile: Optional[str] = None
    subjects: Optional[List[str]] = []
    grades: Optional[List[str]] = []
    districts: Optional[List[str]] = []
    city: Optional[str] = None
    minPrice: Optional[int] = 100000
    maxPrice: Optional[int] = 500000
    teachingMode: Optional[str] = "both"
    schedule: Optional[Dict[str, List[str]]] = None

class TutorApplicationResponse(BaseModel):
    id: int
    userId: int
    fullName: str
    phone: Optional[str] = None
    email: str
    birthday: Optional[str] = None
    address: Optional[str] = None
    introduction: Optional[str] = None
    avatar: Optional[str] = None
    title: Optional[str] = None
    educationLevel: Optional[str] = None
    major: Optional[str] = None
    school: Optional[str] = None
    year: Optional[int] = None
    certificates: List[str] = []
    certificateFile: Optional[str] = None
    subjects: List[str] = []
    grades: List[str] = []
    districts: List[str] = []
    city: Optional[str] = None
    minPrice: int = 100000
    maxPrice: int = 500000
    teachingMode: str = "both"
    status: str = "draft"  # draft, pending, approved, rejected
    verified: bool = False
    rejectionReason: Optional[str] = None

    class Config:
        from_attributes = True

class AdminRejectInput(BaseModel):
    reason: Optional[str] = "Hồ sơ chưa đạt tiêu chuẩn yêu cầu hoặc thông tin chưa rõ ràng."
