from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date, time, datetime

class BookingBase(BaseModel):
    tutor_id: int
    subject_id: Optional[int] = None
    date: date
    start_time: time
    end_time: time
    notes: Optional[str] = None

class BookingCreate(BookingBase):
    pass

class BookingUpdateStatus(BaseModel):
    status: str # pending, confirmed, rejected, completed, cancelled

class BookingStudentInfo(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class BookingTutorInfo(BaseModel):
    id: int
    title: str
    user: BookingStudentInfo # Tutor's user info
    
    model_config = ConfigDict(from_attributes=True)
    
class BookingSubjectInfo(BaseModel):
    id: int
    name: str
    
    model_config = ConfigDict(from_attributes=True)

class BookingResponse(BookingBase):
    id: int
    student_id: int
    status: str
    created_at: datetime
    updated_at: datetime
    
    student: BookingStudentInfo
    tutor: BookingTutorInfo
    subject: Optional[BookingSubjectInfo] = None
    
    model_config = ConfigDict(from_attributes=True)
