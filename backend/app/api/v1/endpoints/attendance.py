import datetime
from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.attendance_service import AttendanceService
from app.schemas.attendance import AttendanceBulkCreate, AttendanceOut, AttendanceSummary
from app.dependencies import get_current_user
from app.models.teacher import Teacher
from app.exceptions import NotFoundException

router = APIRouter()


async def _get_teacher_id(current_user, db: AsyncSession) -> str:
    result = await db.execute(select(Teacher).where(Teacher.user_id == current_user.id))
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise NotFoundException("Teacher profile")
    return teacher.id


@router.post("/bulk", response_model=list[AttendanceOut], status_code=201)
async def mark_attendance(
    data: AttendanceBulkCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    teacher_id = await _get_teacher_id(current_user, db)
    svc = AttendanceService(db)
    return await svc.mark_attendance(data, teacher_id)


@router.get("/class/{class_id}", response_model=list[AttendanceOut])
async def get_class_attendance(
    class_id: str,
    date: datetime.date = Query(...),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = AttendanceService(db)
    return await svc.get_class_attendance(class_id, date)


@router.get("/student/{student_id}/summary", response_model=AttendanceSummary)
async def get_student_summary(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = AttendanceService(db)
    return await svc.get_student_summary(student_id)
