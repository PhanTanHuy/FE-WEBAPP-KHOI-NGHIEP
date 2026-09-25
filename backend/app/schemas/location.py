from pydantic import BaseModel
from typing import Optional

class LocationBase(BaseModel):
    slug: str
    city: str
    district: str

class LocationResponse(LocationBase):
    id: int

    class Config:
        from_attributes = True
