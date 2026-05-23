from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.exam import Exam, Result
from app.repositories.base import BaseRepository


class ExamRepository(BaseRepository[Exam]):
    model = Exam

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_by_session(self, session_year: str) -> list[Exam]:
        result = await self.db.execute(
            select(Exam).where(Exam.session_year == session_year)
        )
        return list(result.scalars().all())

    async def get_results_by_student(self, student_id: str, exam_id: str | None = None) -> list[Result]:
        stmt = select(Result).where(Result.student_id == student_id)
        if exam_id:
            stmt = stmt.where(Result.exam_id == exam_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_results_by_exam_class(self, exam_id: str, class_id: str) -> list[Result]:
        from app.models.student import Student
        result = await self.db.execute(
            select(Result)
            .join(Student, Result.student_id == Student.id)
            .where(Result.exam_id == exam_id, Student.class_id == class_id)
        )
        return list(result.scalars().all())

    async def get_result_by_id(self, id: str) -> Result | None:
        result = await self.db.execute(select(Result).where(Result.id == id))
        return result.scalar_one_or_none()
