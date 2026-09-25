from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class MaterialBase(BaseModel):
    title: str
    description: Optional[str] = None
    subject_id: Optional[int] = None
    level_id: Optional[int] = None
    grade: Optional[str] = "Lớp 12"
    type: str = "material" # exam, material, exercise
    file_format: str = "PDF" # PDF, DOC, ZIP
    is_premium: bool = False
    price: str = "Miễn phí"
    tags: Optional[str] = None
    pages: int = 1
    file_size: str = "2.5 MB"
    file_url: Optional[str] = None

class MaterialCreate(MaterialBase):
    pass

class MaterialResponse(MaterialBase):
    id: int
    author_id: Optional[int] = None
    status: str
    downloads: int
    created_at: datetime
    subject_name: Optional[str] = None
    level_name: Optional[str] = None
    author_name: Optional[str] = None
    is_favorite: bool = False

    model_config = ConfigDict(from_attributes=True)

class MaterialPaginatedResponse(BaseModel):
    items: List[MaterialResponse]
    total: int
    page: int
    per_page: int
    total_pages: int
