from pydantic import BaseModel, EmailStr
from app.models.user import UserRole
from datetime import datetime


class UserBase(BaseModel):
    name: str
    email: EmailStr | None = None
    phone: str | None = None
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    photo: str | None = None


class UserOut(UserBase):
    id: str
    photo: str | None
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class LoginRequest(BaseModel):
    credential: str   # email or phone
    password: str


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    password: str
    role: UserRole = UserRole.STUDENT


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str
