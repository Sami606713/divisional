from datetime import date
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.student import Student
from app.repositories.base import BaseRepository


class StudentRepository(BaseRepository[Student]):
    model = Student

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_by_id(self, id: str) -> Student | None:
        result = await self.db.execute(
            select(Student).options(selectinload(Student.user)).where(Student.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> list[Student]:
        result = await self.db.execute(
            select(Student).options(selectinload(Student.user)).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_roll_number(self, roll_number: str) -> Student | None:
        result = await self.db.execute(
            select(Student).options(selectinload(Student.user)).where(Student.roll_number == roll_number)
        )
        return result.scalar_one_or_none()

    async def get_by_class(self, class_id: str, skip: int = 0, limit: int = 100) -> list[Student]:
        result = await self.db.execute(
            select(Student)
            .options(selectinload(Student.user))
            .where(Student.class_id == class_id)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_parent(self, parent_id: str) -> list[Student]:
        result = await self.db.execute(
            select(Student).options(selectinload(Student.user)).where(Student.parent_id == parent_id)
        )
        return list(result.scalars().all())

    async def generate_roll_number(self, session_year: str) -> str:
        year = session_year[:4]
        result = await self.db.execute(
            select(func.count()).select_from(Student).where(Student.session_year == session_year)
        )
        count = result.scalar_one()
        return f"{year}-{str(count + 1).zfill(3)}"
