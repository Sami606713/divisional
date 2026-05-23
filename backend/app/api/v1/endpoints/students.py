from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.student_service import StudentService
from app.services.attendance_service import AttendanceService
from app.services.exam_service import ExamService
from app.services.fee_service import FeeService
from app.schemas.student import StudentCreate, StudentUpdate, StudentOut
from app.schemas.attendance import AttendanceOut, AttendanceSummary
from app.schemas.exam import ResultOut
from app.schemas.fee import FeeRecordOut
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=list[StudentOut])
async def list_students(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = StudentService(db)
    return await svc.list_students(skip=skip, limit=limit)


@router.post("/", response_model=StudentOut, status_code=201)
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = StudentService(db)
    return await svc.create_student(data)


@router.get("/{student_id}", response_model=StudentOut)
async def get_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = StudentService(db)
    return await svc.get_student(student_id)


@router.put("/{student_id}", response_model=StudentOut)
async def update_student(
    student_id: str,
    data: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = StudentService(db)
    return await svc.update_student(student_id, data)


@router.delete("/{student_id}", status_code=204)
async def deactivate_student(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = StudentService(db)
    await svc.deactivate_student(student_id)


@router.get("/{student_id}/attendance", response_model=AttendanceSummary)
async def student_attendance_summary(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = AttendanceService(db)
    return await svc.get_student_summary(student_id)


@router.get("/{student_id}/results", response_model=list[ResultOut])
async def student_results(
    student_id: str,
    exam_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = ExamService(db)
    return await svc.get_student_results(student_id, exam_id)


@router.get("/{student_id}/fees", response_model=list[FeeRecordOut])
async def student_fees(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = FeeService(db)
    return await svc.get_student_fees(student_id)
