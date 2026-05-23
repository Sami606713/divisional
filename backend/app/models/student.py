from sqlalchemy import String, Date, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import enum
import datetime


class Gender(str, enum.Enum):
    MALE = "male"
    FEMALE = "female"


class Student(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "students"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    roll_number: Mapped[str] = mapped_column(String(30), unique=True, nullable=False)
    father_name: Mapped[str] = mapped_column(String(255), nullable=False)
    date_of_birth: Mapped[datetime.date | None] = mapped_column(Date, nullable=True)
    gender: Mapped[Gender] = mapped_column(SAEnum(Gender), nullable=False)
    cnic_or_bform: Mapped[str | None] = mapped_column(String(20), nullable=True)
    address: Mapped[str | None] = mapped_column(String(500), nullable=True)
    session_year: Mapped[str] = mapped_column(String(20), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user: Mapped["User"] = relationship(back_populates="student")  # noqa: F821
    class_id: Mapped[str | None] = mapped_column(ForeignKey("classes.id"), nullable=True)
    parent_id: Mapped[str | None] = mapped_column(ForeignKey("parents.id"), nullable=True)

    school_class: Mapped["Class"] = relationship(back_populates="students")  # noqa: F821
    parent: Mapped["Parent"] = relationship(back_populates="children")  # noqa: F821
    attendances: Mapped[list["Attendance"]] = relationship(back_populates="student")  # noqa: F821
    results: Mapped[list["Result"]] = relationship(back_populates="student")  # noqa: F821
    fee_records: Mapped[list["FeeRecord"]] = relationship(back_populates="student")  # noqa: F821
