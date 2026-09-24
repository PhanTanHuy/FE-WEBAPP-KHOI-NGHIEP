from pydantic import BaseModel
from typing import Optional

class LevelBase(BaseModel):
    slug: str
    name: str
    grades: Optional[str] = None

class LevelResponse(LevelBase):
    id: int

    class Config:
        from_attributes = True
