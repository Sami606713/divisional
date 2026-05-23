from sqlalchemy import Date, String, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import enum
import datetime


class AttendanceStatus(str, enum.Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"
    LEAVE = "leave"


class Attendance(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "attendances"

    student_id: Mapped[str] = mapped_column(ForeignKey("students.id"), nullable=False)
    date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    status: Mapped[AttendanceStatus] = mapped_column(SAEnum(AttendanceStatus), nullable=False)
    subject_id: Mapped[str | None] = mapped_column(ForeignKey("subjects.id"), nullable=True)
    marked_by_id: Mapped[str] = mapped_column(ForeignKey("teachers.id"), nullable=False)
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    student: Mapped["Student"] = relationship(back_populates="attendances")  # noqa: F821
