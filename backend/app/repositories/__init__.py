from app.repositories.base import BaseRepository
from app.repositories.user_repo import UserRepository
from app.repositories.student_repo import StudentRepository
from app.repositories.teacher_repo import TeacherRepository
from app.repositories.attendance_repo import AttendanceRepository
from app.repositories.exam_repo import ExamRepository
from app.repositories.fee_repo import FeeRepository
from app.repositories.notice_repo import NoticeRepository

__all__ = [
    "BaseRepository",
    "UserRepository",
    "StudentRepository",
    "TeacherRepository",
    "AttendanceRepository",
    "ExamRepository",
    "FeeRepository",
    "NoticeRepository",
]
