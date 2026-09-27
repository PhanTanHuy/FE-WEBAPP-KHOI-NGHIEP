# app/schemas/feedback.py

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class FeedbackCreate(BaseModel):
    role: str = Field(..., max_length=50)

    source: str | None = Field(
        default=None,
        max_length=100
    )

    purpose: str | None = Field(
        default=None,
        max_length=100
    )

    found_information: str | None = Field(
        default=None,
        max_length=100
    )

    ease_of_use: int | None = Field(
        default=None,
        ge=1,
        le=5
    )

    interested_features: list[str] = []

    tutor_priority: str | None = Field(
        default=None,
        max_length=100
    )

    price_range: str | None = Field(
        default=None,
        max_length=100
    )

    trust_level: int | None = Field(
        default=None,
        ge=1,
        le=5
    )

    usage_intention: str | None = Field(
        default=None,
        max_length=100
    )

    difficulty: str | None = None

    desired_features: str | None = None

    contact_requested: bool = False

    contact_value: str | None = Field(
        default=None,
        max_length=255
    )

    answers: dict[str, Any] = {}


class FeedbackResponse(BaseModel):
    id: int
    role: str
    source: str | None
    purpose: str | None
    found_information: str | None
    ease_of_use: int | None
    tutor_priority: str | None
    price_range: str | None
    trust_level: int | None
    usage_intention: str | None
    difficulty: str | None
    desired_features: str | None
    contact_requested: bool
    contact_value: str | None
    answers: dict[str, Any]
    created_at: datetime

    model_config = {
        "from_attributes": True
    }