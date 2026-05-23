from sqlalchemy import String, Integer, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin
import enum


class Day(str, enum.Enum):
    SAT = "sat"
    SUN = "sun"
    MON = "mon"
    TUE = "tue"
    WED = "wed"
    THU = "thu"


class Timetable(Base, UUIDMixin):
    __tablename__ = "timetable"

    class_id: Mapped[str] = mapped_column(ForeignKey("classes.id"), nullable=False)
    subject_id: Mapped[str] = mapped_column(ForeignKey("subjects.id"), nullable=False)
    teacher_id: Mapped[str] = mapped_column(ForeignKey("teachers.id"), nullable=False)
    day: Mapped[Day] = mapped_column(SAEnum(Day), nullable=False)
    period: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[str] = mapped_column(String(10), nullable=False)  # "08:00"
    end_time: Mapped[str] = mapped_column(String(10), nullable=False)    # "08:40"

    school_class: Mapped["Class"] = relationship(back_populates="timetable_slots")  # noqa: F821
    subject: Mapped["Subject"] = relationship(back_populates="timetable_slots")  # noqa: F821
    teacher: Mapped["Teacher"] = relationship(back_populates="timetable_slots")  # noqa: F821
