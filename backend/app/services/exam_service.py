from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.exam_repo import ExamRepository
from app.models.exam import Exam, Result
from app.schemas.exam import ExamCreate, ResultBulkCreate
from app.exceptions import NotFoundException, BadRequestException


class ExamService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = ExamRepository(db)

    def calculate_grade(self, marks: float, total: float) -> tuple[str, bool]:
        if total == 0:
            return "F", False
        pct = (marks / total) * 100
        if pct >= 90:
            return "A+", True
        elif pct >= 80:
            return "A", True
        elif pct >= 70:
            return "B", True
        elif pct >= 60:
            return "C", True
        elif pct >= 50:
            return "D", True
        elif pct >= 33:
            return "E", True
        else:
            return "F", False

    async def create_exam(self, data: ExamCreate) -> Exam:
        exam = Exam(
            name=data.name,
            type=data.type,
            session_year=data.session_year,
            start_date=data.start_date,
            end_date=data.end_date,
        )
        return await self.repo.create(exam)

    async def enter_results(self, data: ResultBulkCreate, teacher_id: str) -> list[Result]:
        exam = await self.repo.get_by_id(data.exam_id)
        if not exam:
            raise NotFoundException("Exam")
        if exam.is_published:
            raise BadRequestException("Cannot enter results for a published exam")

        results = []
        for entry in data.entries:
            grade, is_passed = self.calculate_grade(entry.marks_obtained, data.total_marks)
            percentage = round((entry.marks_obtained / data.total_marks) * 100, 2) if data.total_marks else 0.0
            result = Result(
                student_id=entry.student_id,
                exam_id=data.exam_id,
                subject_id=data.subject_id,
                marks_obtained=entry.marks_obtained,
                total_marks=data.total_marks,
                percentage=percentage,
                grade=grade,
                is_passed=is_passed,
                teacher_id=teacher_id,
            )
            self.repo.db.add(result)
            await self.repo.db.flush()
            await self.repo.db.refresh(result)
            results.append(result)
        return results

    async def get_student_results(self, student_id: str, exam_id: str | None = None) -> list[Result]:
        return await self.repo.get_results_by_student(student_id, exam_id)

    async def publish_exam(self, exam_id: str) -> Exam:
        exam = await self.repo.get_by_id(exam_id)
        if not exam:
            raise NotFoundException("Exam")
        return await self.repo.update(exam, {"is_published": True})
