# Import all models so Alembic can detect them for migrations
from app.models.user import User, UserRole
from app.models.student import Student, Gender
from app.models.teacher import Teacher
from app.models.parent import Parent
from app.models.class_ import Class
from app.models.subject import Subject
from app.models.attendance import Attendance, AttendanceStatus
from app.models.exam import Exam, Result, ExamType
from app.models.fee import FeeStructure, FeeRecord, FeeType, FeeStatus
from app.models.notice import Notice, NoticeType
from app.models.timetable import Timetable, Day
