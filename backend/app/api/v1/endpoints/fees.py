from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.fee_service import FeeService
from app.schemas.fee import FeeStructureCreate, FeeStructureOut, FeePaymentCreate, FeeRecordOut
from app.dependencies import get_current_user

router = APIRouter()


@router.post("/structures", response_model=FeeStructureOut, status_code=201)
async def create_structure(
    data: FeeStructureCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = FeeService(db)
    return await svc.create_structure(data)


@router.get("/structures", response_model=list[FeeStructureOut])
async def list_structures(
    class_id: str | None = Query(None),
    session_year: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = FeeService(db)
    if class_id:
        return await svc.repo.get_structure_by_class(class_id, session_year)
    return await svc.repo.get_all()


@router.post("/payments", response_model=FeeRecordOut, status_code=201)
async def record_payment(
    data: FeePaymentCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = FeeService(db)
    return await svc.record_payment(data)


@router.get("/student/{student_id}", response_model=list[FeeRecordOut])
async def get_student_fees(
    student_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = FeeService(db)
    return await svc.get_student_fees(student_id)
