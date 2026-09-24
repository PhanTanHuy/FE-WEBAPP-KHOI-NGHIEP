from pydantic import BaseModel
from typing import Optional

class SubjectBase(BaseModel):
    slug: str
    name: str
    icon: Optional[str] = None
    color: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: int

    class Config:
        from_attributes = True
