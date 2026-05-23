import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.attendance_repo import AttendanceRepository
from app.repositories.student_repo import StudentRepository
from app.models.attendance import Attendance
from app.schemas.attendance import AttendanceBulkCreate, AttendanceSummary
from app.exceptions import NotFoundException


class AttendanceService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = AttendanceRepository(db)
        self.student_repo = StudentRepository(db)

    async def mark_attendance(self, data: AttendanceBulkCreate, teacher_id: str) -> list[Attendance]:
        records = []
        for entry in data.entries:
            attendance = Attendance(
                student_id=entry.student_id,
                date=data.date,
                status=entry.status,
                subject_id=data.subject_id,
                marked_by_id=teacher_id,
                remarks=entry.remarks,
            )
            await self.repo.create(attendance)
            records.append(attendance)
        return records

    async def get_class_attendance(self, class_id: str, date: datetime.date) -> list[Attendance]:
        return await self.repo.get_by_class_date(class_id, date)

    async def get_student_summary(self, student_id: str) -> AttendanceSummary:
        student = await self.student_repo.get_by_id(student_id)
        if not student:
            raise NotFoundException("Student")
        summary = await self.repo.get_summary(student_id)
        total = sum(summary.values())
        present = summary.get("present", 0)
        return AttendanceSummary(
            student_id=student_id,
            student_name=student.user.name,
            total_days=total,
            present=present,
            absent=summary.get("absent", 0),
            late=summary.get("late", 0),
            leave=summary.get("leave", 0),
            percentage=round((present / total * 100), 2) if total > 0 else 0.0,
        )
