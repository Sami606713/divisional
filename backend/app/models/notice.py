from sqlalchemy import String, Boolean, DateTime, ForeignKey, Enum as SAEnum, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
from app.models.user import UserRole
import enum
import datetime


class NoticeType(str, enum.Enum):
    GENERAL = "general"
    ACADEMIC = "academic"
    FEE = "fee"
    STAFF = "staff"
    EXAM = "exam"


class Notice(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notices"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(String(5000), nullable=False)
    notice_type: Mapped[NoticeType] = mapped_column(SAEnum(NoticeType), nullable=False)
    attachment: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_pinned: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    published_at: Mapped[datetime.datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_by_id: Mapped[str] = mapped_column(ForeignKey("users.id"), nullable=False)
