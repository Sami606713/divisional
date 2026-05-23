from sqlalchemy import String, Date, Boolean, Float, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import enum
import datetime


class ExamType(str, enum.Enum):
    MONTHLY = "monthly"
    MIDTERM = "midterm"
    ANNUAL = "annual"
    BOARD = "board"


class Exam(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "exams"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[ExamType] = mapped_column(SAEnum(ExamType), nullable=False)
    session_year: Mapped[str] = mapped_column(String(20), nullable=False)
    start_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    end_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    results: Mapped[list["Result"]] = relationship(back_populates="exam")  # noqa: F821


class Result(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "results"

    student_id: Mapped[str] = mapped_column(ForeignKey("students.id"), nullable=False)
    exam_id: Mapped[str] = mapped_column(ForeignKey("exams.id"), nullable=False)
    subject_id: Mapped[str] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    marks_obtained: Mapped[float] = mapped_column(Float, nullable=False)
    total_marks: Mapped[float] = mapped_column(Float, nullable=False)
    percentage: Mapped[float] = mapped_column(Float, nullable=False)
    grade: Mapped[str] = mapped_column(String(5), nullable=False)
    is_passed: Mapped[bool] = mapped_column(Boolean, nullable=False)
    is_locked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    teacher_id: Mapped[str] = mapped_column(ForeignKey("teachers.id"), nullable=False)

    student: Mapped["Student"] = relationship(back_populates="results")  # noqa: F821
    exam: Mapped["Exam"] = relationship(back_populates="results")  # noqa: F821
    subject: Mapped["Subject"] = relationship(back_populates="results")  # noqa: F821
    entered_by: Mapped["Teacher"] = relationship(back_populates="results_entered")  # noqa: F821
