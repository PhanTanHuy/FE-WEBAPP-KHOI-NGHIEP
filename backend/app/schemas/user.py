import re
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    phone: Optional[str] = None

    @field_validator("email", mode="before")
    @classmethod
    def normalize_email(cls, value: str) -> str:
        return value.strip().lower() if isinstance(value, str) else value

    @field_validator("full_name")
    @classmethod
    def normalize_full_name(cls, value: str) -> str:
        normalized = " ".join(value.split())
        if len(normalized) < 2:
            raise ValueError("Họ và tên phải có ít nhất 2 ký tự")
        return normalized

    @field_validator("phone")
    @classmethod
    def normalize_phone(cls, value: Optional[str]) -> Optional[str]:
        if value is None or not value.strip():
            return None
        normalized = re.sub(r"[\s.-]", "", value)
        if not re.fullmatch(r"\+?\d{9,15}", normalized):
            raise ValueError("Số điện thoại không hợp lệ")
        return normalized

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=72)

    model_config = ConfigDict(extra="forbid")

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if len(value.encode("utf-8")) > 72:
            raise ValueError("Mật khẩu không được dài quá 72 byte")
        if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
            raise ValueError("Mật khẩu phải có cả chữ và số")
        return value

class UserResponse(UserBase):
    id: int
    role: str
    avatar_url: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
