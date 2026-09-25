from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class EducationItem(BaseModel):
    degree: str
    major: str
    school: str
    year: Optional[int] = None

    class Config:
        from_attributes = True

class ReviewItem(BaseModel):
    id: int
    studentName: Optional[str] = "Học sinh"
    rating: int
    comment: str
    date: str
    avatar: Optional[str] = "https://i.pravatar.cc/150?img=12"

    class Config:
        from_attributes = True

class TutorListItem(BaseModel):
    id: int
    name: str
    avatar: Optional[str] = None
    title: str
    subjects: List[str]
    levels: List[str]
    rating: float
    reviewCount: int
    pricePerHour: int
    location: str
    district: Optional[str] = None
    city: Optional[str] = None
    teachingMode: List[str]
    verified: bool
    experience: int
    bio: str
    completedLessons: int
    studentCount: int

class TutorDetail(TutorListItem):
    education: List[EducationItem] = []
    certifications: List[str] = []
    schedule: Dict[str, List[str]] = {}
    reviews: List[ReviewItem] = []

class TutorPaginationResponse(BaseModel):
    items: List[TutorListItem]
    total: int
    page: int
    per_page: int
    total_pages: int

class AvailabilityResponse(BaseModel):
    tutorId: int
    schedule: Dict[str, List[str]]

class AvailabilityUpdateInput(BaseModel):
    schedule: Dict[str, List[str]]

