from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin


class Subject(Base, UUIDMixin):
    __tablename__ = "subjects"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    class_id: Mapped[str] = mapped_column(ForeignKey("classes.id"), nullable=False)
    teacher_id: Mapped[str | None] = mapped_column(ForeignKey("teachers.id"), nullable=True)

    school_class: Mapped["Class"] = relationship(back_populates="subjects")  # noqa: F821
    teacher: Mapped["Teacher | None"] = relationship(back_populates="subjects")  # noqa: F821
    timetable_slots: Mapped[list["Timetable"]] = relationship(back_populates="subject")  # noqa: F821
    results: Mapped[list["Result"]] = relationship(back_populates="subject")  # noqa: F821
