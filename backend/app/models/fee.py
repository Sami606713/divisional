from sqlalchemy import String, Float, Date, Boolean, ForeignKey, Enum as SAEnum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import enum
import datetime


class FeeType(str, enum.Enum):
    ADMISSION = "admission"
    TUITION = "tuition"
    EXAM = "exam"
    LIBRARY = "library"
    SPORTS = "sports"
    OTHER = "other"


class FeeStatus(str, enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    PARTIAL = "partial"
    OVERDUE = "overdue"
    WAIVED = "waived"


class FeeStructure(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fee_structures"

    class_id: Mapped[str] = mapped_column(ForeignKey("classes.id"), nullable=False)
    fee_type: Mapped[FeeType] = mapped_column(SAEnum(FeeType), nullable=False)
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    session_year: Mapped[str] = mapped_column(String(20), nullable=False)
    due_day: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    late_fine: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    school_class: Mapped["Class"] = relationship(back_populates="fee_structures")  # noqa: F821


class FeeRecord(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "fee_records"

    student_id: Mapped[str] = mapped_column(ForeignKey("students.id"), nullable=False)
    fee_type: Mapped[FeeType] = mapped_column(SAEnum(FeeType), nullable=False)
    month: Mapped[str] = mapped_column(String(10), nullable=False)   # "2025-06"
    amount: Mapped[float] = mapped_column(Float, nullable=False)
    discount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    net_amount: Mapped[float] = mapped_column(Float, nullable=False)
    paid_amount: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[FeeStatus] = mapped_column(SAEnum(FeeStatus), default=FeeStatus.PENDING)
    due_date: Mapped[datetime.date] = mapped_column(Date, nullable=False)
    paid_date: Mapped[datetime.date | None] = mapped_column(Date, nullable=True)
    payment_method: Mapped[str | None] = mapped_column(String(50), nullable=True)
    receipt_no: Mapped[str | None] = mapped_column(String(50), unique=True, nullable=True)
    remarks: Mapped[str | None] = mapped_column(String(255), nullable=True)

    student: Mapped["Student"] = relationship(back_populates="fee_records")  # noqa: F821
