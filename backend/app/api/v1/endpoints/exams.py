from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.exam_service import ExamService
from app.schemas.exam import ExamCreate, ExamOut, ResultBulkCreate, ResultOut
from app.dependencies import get_current_user
from app.models.teacher import Teacher
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


@router.post("/{exam_id}/publish", response_model=ExamOut)
async def publish_exam(
    exam_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    return await svc.publish_exam(exam_id)
