from pydantic import BaseModel
from datetime import date, datetime


class TeacherCreate(BaseModel):
    name: str
    email: str | None = None
    phone: str | None = None
    password: str
    father_name: str | None = None
    cnic: str | None = None
    qualification: str | None = None
    joining_date: date | None = None
    salary: float | None = None


class TeacherUpdate(BaseModel):
    father_name: str | None = None
    qualification: str | None = None
    joining_date: date | None = None
    salary: float | None = None


class TeacherOut(BaseModel):
    id: str
    father_name: str | None
    cnic: str | None
    qualification: str | None
    joining_date: date | None
    salary: float | None
    created_at: datetime
    user: "UserBrief"

    model_config = {"from_attributes": True}


class UserBrief(BaseModel):
    id: str
    name: str
    email: str | None
    phone: str | None
    photo: str | None

    model_config = {"from_attributes": True}
