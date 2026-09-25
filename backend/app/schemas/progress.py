from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import date, time, datetime

class AssignmentBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None

class AssignmentCreate(AssignmentBase):
    pass

class AssignmentResponse(AssignmentBase):
    id: int
    session_id: int
    status: str
    submitted_at: Optional[datetime] = None
    grade: Optional[float] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class ProgressReportBase(BaseModel):
    content: str
    score: Optional[float] = None
    homework: Optional[str] = None

class ProgressReportCreate(ProgressReportBase):
    pass

class ProgressReportResponse(ProgressReportBase):
    id: int
    session_id: int
    tutor_id: int
    student_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class LessonSessionBase(BaseModel):
    booking_id: int
    session_number: int = 1
    date: date
    start_time: time
    end_time: time
    status: str = "scheduled"
    notes: Optional[str] = None

class LessonSessionCreate(BaseModel):
    booking_id: int
    session_number: Optional[int] = 1
    date: date
    start_time: time
    end_time: time
    notes: Optional[str] = None

class LessonSessionResponse(LessonSessionBase):
    id: int
    created_at: datetime
    progress_report: Optional[ProgressReportResponse] = None
    assignments: List[AssignmentResponse] = []

    model_config = ConfigDict(from_attributes=True)

class SubjectProgressItem(BaseModel):
    subject_id: Optional[int] = None
    subject_name: str
    tutor_name: str
    tutor_avatar: Optional[str] = None
    total_sessions: int
    completed_sessions: int
    progress_percent: int
    status: str
    average_score: Optional[float] = None
    last_session_date: Optional[str] = None

class StudentProgressSummary(BaseModel):
    total_subjects: int
    total_hours: float
    average_score: float
    assignment_completion_rate: int
    subjects: List[SubjectProgressItem]
    recent_sessions: List[Any] = []
