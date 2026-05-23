from pydantic import BaseModel
from datetime import datetime


class ClassCreate(BaseModel):
    name: str
    section: str
    session_year: str
    capacity: int = 45
    class_teacher_id: str | None = None


class ClassUpdate(BaseModel):
    name: str | None = None
    section: str | None = None
    capacity: int | None = None
    class_teacher_id: str | None = None


class ClassOut(BaseModel):
    id: str
    name: str
    section: str
    session_year: str
    capacity: int
    class_teacher_id: str | None
    created_at: datetime
    student_count: int = 0

    model_config = {"from_attributes": True}
