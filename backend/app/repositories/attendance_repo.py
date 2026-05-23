import datetime
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.attendance import Attendance, AttendanceStatus
from app.repositories.base import BaseRepository


class AttendanceRepository(BaseRepository[Attendance]):
    model = Attendance

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_by_class_date(self, class_id: str, date: datetime.date) -> list[Attendance]:
        from app.models.student import Student
        result = await self.db.execute(
            select(Attendance)
            .join(Student, Attendance.student_id == Student.id)
            .where(Student.class_id == class_id, Attendance.date == date)
        )
        return list(result.scalars().all())

    async def get_by_student_range(
        self,
        student_id: str,
        start: datetime.date,
        end: datetime.date,
    ) -> list[Attendance]:
        result = await self.db.execute(
            select(Attendance).where(
                Attendance.student_id == student_id,
                Attendance.date >= start,
                Attendance.date <= end,
            )
        )
        return list(result.scalars().all())

    async def get_summary(self, student_id: str) -> dict[str, int]:
        result = await self.db.execute(
            select(Attendance.status, func.count().label("cnt"))
            .where(Attendance.student_id == student_id)
            .group_by(Attendance.status)
        )
        rows = result.all()
        summary = {s.value: 0 for s in AttendanceStatus}
        for status, cnt in rows:
            summary[status.value] = cnt
        return summary
