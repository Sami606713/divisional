from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.exam_service import ExamService
from app.schemas.exam import ExamCreate, ExamOut, PublicExamResultsSummary, PublicMeritEntry, ResultBulkCreate, ResultOut
from app.dependencies import get_current_user
from app.models.teacher import Teacher
from app.models.exam import Result
from app.models.student import Student
from app.models.class_ import Class
from app.models.user import User
from sqlalchemy import select
from app.exceptions import NotFoundException

router = APIRouter()


async def _get_teacher_id(current_user, db: AsyncSession) -> str:
    result = await db.execute(select(Teacher).where(Teacher.user_id == current_user.id))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise NotFoundException("Teacher profile")
    return teacher.id


@router.get("/", response_model=list[ExamOut])
async def list_exams(
    session_year: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    if session_year:
        return await svc.repo.get_by_session(session_year)
    return await svc.repo.get_all()


@router.get("/public", response_model=list[ExamOut])
async def list_exams_public(
    session_year: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
):
    svc = ExamService(db)
    exams = await (svc.repo.get_by_session(session_year) if session_year else svc.repo.get_all())
    return [exam for exam in exams if exam.is_published]


@router.post("/", response_model=ExamOut, status_code=201)
async def create_exam(
    data: ExamCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    return await svc.create_exam(data)


@router.get("/{exam_id}", response_model=ExamOut)
async def get_exam(
    exam_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    exam = await svc.repo.get_by_id(exam_id)
    if not exam:
        raise NotFoundException("Exam")
    return exam


@router.post("/results/bulk", response_model=list[ResultOut], status_code=201)
async def enter_results(
    data: ResultBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    teacher_id = await _get_teacher_id(current_user, db)
    svc = ExamService(db)
    return await svc.enter_results(data, teacher_id)


@router.get("/results/student/{student_id}", response_model=list[ResultOut])
async def get_student_results(
    student_id: str,
    exam_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    return await svc.get_student_results(student_id, exam_id)


@router.get("/public/{exam_id}/results", response_model=PublicExamResultsSummary)
async def get_public_exam_results(
    exam_id: str,
    db: AsyncSession = Depends(get_db),
):
    svc = ExamService(db)
    exam = await svc.repo.get_by_id(exam_id)
    if not exam or not exam.is_published:
        raise NotFoundException("Exam")

    result = await db.execute(
        select(Result, Student, Class, User)
        .join(Student, Result.student_id == Student.id)
        .join(User, Student.user_id == User.id)
        .outerjoin(Class, Student.class_id == Class.id)
        .where(Result.exam_id == exam_id)
    )
    rows = result.all()

    by_student: dict[str, dict[str, object]] = {}
    for result_row, student, school_class, user in rows:
        entry = by_student.setdefault(
            student.id,
            {
                "student_id": student.id,
                "student_name": user.name,
                "class_name": f"{school_class.name}-{school_class.section}" if school_class else "—",
                "total_marks": 0.0,
                "obtained_marks": 0.0,
            },
        )
        entry["total_marks"] = float(entry["total_marks"]) + float(result_row.total_marks)
        entry["obtained_marks"] = float(entry["obtained_marks"]) + float(result_row.marks_obtained)

    merit_entries: list[PublicMeritEntry] = []
    for item in by_student.values():
        total_marks = float(item["total_marks"])
        obtained_marks = float(item["obtained_marks"])
        percentage = round((obtained_marks / total_marks) * 100, 2) if total_marks else 0.0
        grade, _ = svc.calculate_grade(obtained_marks, total_marks)
        merit_entries.append(
            PublicMeritEntry(
                student_id=str(item["student_id"]),
                student_name=str(item["student_name"]),
                class_name=str(item["class_name"]),
                total_marks=total_marks,
                obtained_marks=obtained_marks,
                percentage=percentage,
                grade=grade,
                rank=0,
            )
        )

    merit_entries.sort(key=lambda item: (-item.percentage, -item.obtained_marks, item.student_name))
    for index, item in enumerate(merit_entries, start=1):
        item.rank = index

    total_students = len(merit_entries)
    passed_students = len([item for item in merit_entries if item.grade != "F"])
    pass_rate = round((passed_students / total_students) * 100, 2) if total_students else 0.0
    a_plus_students = len([item for item in merit_entries if item.grade == "A+"])

    return PublicExamResultsSummary(
        exam=ExamOut.model_validate(exam),
        pass_rate=pass_rate,
        a_plus_students=a_plus_students,
        total_students=total_students,
        merit_list=merit_entries,
    )


@router.post("/{exam_id}/publish", response_model=ExamOut)
async def publish_exam(
    exam_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    return await svc.publish_exam(exam_id)
