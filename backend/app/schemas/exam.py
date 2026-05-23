from pydantic import BaseModel
from app.models.exam import ExamType
from datetime import date


class ExamCreate(BaseModel):
    name: str
    type: ExamType
    session_year: str
    start_date: date
    end_date: date


class ExamOut(BaseModel):
    id: str
    name: str
    type: ExamType
    session_year: str
    start_date: date
    end_date: date
    is_published: bool

    model_config = {"from_attributes": True}


class ResultEntry(BaseModel):
    student_id: str
    marks_obtained: float


class ResultBulkCreate(BaseModel):
    exam_id: str
    subject_id: str
    class_id: str
    total_marks: float
    entries: list[ResultEntry]


class ResultOut(BaseModel):
    id: str
    student_id: str
    exam_id: str
    subject_id: str
    marks_obtained: float
    total_marks: float
    percentage: float
    grade: str
    is_passed: bool

    model_config = {"from_attributes": True}


class PublicMeritEntry(BaseModel):
    student_id: str
    student_name: str
    class_name: str
    total_marks: float
    obtained_marks: float
    percentage: float
    grade: str
    rank: int


class PublicExamResultsSummary(BaseModel):
    exam: ExamOut
    pass_rate: float
    a_plus_students: int
    total_students: int
    merit_list: list[PublicMeritEntry]
