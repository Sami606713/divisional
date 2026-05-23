from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base
from app.models.base import UUIDMixin, TimestampMixin


class Parent(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "parents"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"), unique=True, nullable=False)
    cnic: Mapped[str | None] = mapped_column(String(20), nullable=True)
    occupation: Mapped[str | None] = mapped_column(String(100), nullable=True)

    user: Mapped["User"] = relationship(back_populates="parent")  # noqa: F821
    children: Mapped[list["Student"]] = relationship(back_populates="parent")  # noqa: F821
