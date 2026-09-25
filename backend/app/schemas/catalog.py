from app.schemas.base import ApiSchema


class SubjectOut(ApiSchema):
    id: int
    slug: str
    name: str
    icon: str | None = None
    color: str | None = None


class LevelOut(ApiSchema):
    id: int
    slug: str
    name: str
    grades: str | None = None


class LocationOut(ApiSchema):
    id: int
    slug: str
    city: str
    district: str
