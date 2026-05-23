from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.teacher import Teacher
from app.models.subject import Subject
from app.repositories.base import BaseRepository


class TeacherRepository(BaseRepository[Teacher]):
    model = Teacher

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_by_id(self, id: str) -> Teacher | None:
        result = await self.db.execute(
            select(Teacher).options(selectinload(Teacher.user)).where(Teacher.id == id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> list[Teacher]:
        result = await self.db.execute(
            select(Teacher).options(selectinload(Teacher.user)).offset(skip).limit(limit)
        )
        return list(result.scalars().all())

    async def get_by_employee_code(self, code: str) -> Teacher | None:
        # Employee code stored as cnic for simplicity; adapt if separate field added
        result = await self.db.execute(
            select(Teacher).options(selectinload(Teacher.user)).where(Teacher.cnic == code)
        )
        return result.scalar_one_or_none()

    async def get_by_subject(self, subject_id: str) -> list[Teacher]:
        result = await self.db.execute(
            select(Teacher)
            .options(selectinload(Teacher.user))
            .join(Teacher.timetable_slots)
            .where(Teacher.timetable_slots.any(subject_id=subject_id))
        )
        return list(result.scalars().unique().all())

    async def generate_employee_code(self) -> str:
        result = await self.db.execute(select(func.count()).select_from(Teacher))
        count = result.scalar_one()
        return f"EMP-{str(count + 1).zfill(4)}"
