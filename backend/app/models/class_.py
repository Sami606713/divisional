from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Class(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "classes"

    name: Mapped[str] = mapped_column(String(10), nullable=False)       # "9", "10"
    section: Mapped[str] = mapped_column(String(5), nullable=False)     # "A", "B"
    session_year: Mapped[str] = mapped_column(String(20), nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, default=45, nullable=False)
    class_teacher_id: Mapped[str | None] = mapped_column(ForeignKey("teachers.id"), nullable=True)

    class_teacher: Mapped["Teacher"] = relationship(back_populates="class_teacher_of")  # noqa: F821
    students: Mapped[list["Student"]] = relationship(back_populates="school_class")  # noqa: F821
    subjects: Mapped[list["Subject"]] = relationship(back_populates="school_class")  # noqa: F821
    timetable_slots: Mapped[list["Timetable"]] = relationship(back_populates="school_class")  # noqa: F821
    fee_structures: Mapped[list["FeeStructure"]] = relationship(back_populates="school_class")  # noqa: F821
