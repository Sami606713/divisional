from pydantic import BaseModel
from app.models.student import Gender
from datetime import date, datetime


class StudentCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    password: str
    father_name: str
    date_of_birth: date | None = None
    gender: Gender
    cnic_or_bform: str | None = None
    address: str | None = None
    class_id: str | None = None
    parent_id: str | None = None
    session_year: str


class StudentUpdate(BaseModel):
    father_name: str | None = None
    date_of_birth: date | None = None
    address: str | None = None
    class_id: str | None = None
    parent_id: str | None = None


class StudentOut(BaseModel):
    id: str
    roll_number: str
    father_name: str
    gender: Gender
    session_year: str
    is_active: bool
    created_at: datetime
    user: "UserBrief"
    class_id: str | None

    model_config = {"from_attributes": True}


class UserBrief(BaseModel):
    id: str
    name: str
    email: str | None
    phone: str | None
    photo: str | None

    model_config = {"from_attributes": True}
