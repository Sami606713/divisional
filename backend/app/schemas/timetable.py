from pydantic import BaseModel
from app.models.timetable import Day


class TimetableCreate(BaseModel):
    class_id: str
    subject_id: str
    teacher_id: str
    day: Day
    period: int
    start_time: str
    end_time: str


class TimetableOut(BaseModel):
    id: str
    class_id: str
    subject_id: str
    teacher_id: str
    day: Day
    period: int
    start_time: str
    end_time: str

    model_config = {"from_attributes": True}
