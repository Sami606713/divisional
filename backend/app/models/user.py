from sqlalchemy import String, Boolean, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin
import enum


class UserRole(str, enum.Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(20), unique=True, nullable=True)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), nullable=False)
    photo: Mapped[str | None] = mapped_column(String(500), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    student: Mapped["Student"] = relationship(back_populates="user", uselist=False)  # noqa: F821
    teacher: Mapped["Teacher"] = relationship(back_populates="user", uselist=False)  # noqa: F821
    parent: Mapped["Parent"] = relationship(back_populates="user", uselist=False)  # noqa: F821
