from pydantic import BaseModel
from app.models.attendance import AttendanceStatus
from datetime import date


class AttendanceEntry(BaseModel):
    student_id: str
    status: AttendanceStatus
    remarks: str | None = None


class AttendanceBulkCreate(BaseModel):
    class_id: str
    subject_id: str | None = None
    date: date
    entries: list[AttendanceEntry]


class AttendanceOut(BaseModel):
    id: str
    student_id: str
    date: date
    status: AttendanceStatus
    remarks: str | None

    model_config = {"from_attributes": True}


class AttendanceSummary(BaseModel):
    student_id: str
    student_name: str
    total_days: int
    present: int
    absent: int
    late: int
    leave: int
    percentage: float
