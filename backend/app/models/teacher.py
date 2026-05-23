from sqlalchemy import String, Date, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import datetime


class Teacher(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "teachers"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    father_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    cnic: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    qualification: Mapped[str | None] = mapped_column(String(255), nullable=True)
    joining_date: Mapped[datetime.date | None] = mapped_column(Date, nullable=True)
    salary: Mapped[float | None] = mapped_column(Float, nullable=True)

    user: Mapped["User"] = relationship(back_populates="teacher")  # noqa: F821
    class_teacher_of: Mapped["Class"] = relationship(back_populates="class_teacher", uselist=False)  # noqa: F821
    timetable_slots: Mapped[list["Timetable"]] = relationship(back_populates="teacher")  # noqa: F821
    results_entered: Mapped[list["Result"]] = relationship(back_populates="entered_by")  # noqa: F821
