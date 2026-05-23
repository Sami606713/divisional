from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.teacher_service import TeacherService
from app.schemas.teacher import TeacherCreate, TeacherUpdate, TeacherOut
from app.dependencies import get_current_user
from app.models.teacher import Teacher
from app.exceptions import NotFoundException

router = APIRouter()


@router.get("/me", response_model=TeacherOut)
async def get_my_teacher_profile(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(Teacher).options(selectinload(Teacher.user)).where(Teacher.user_id == current_user.id)
    )
    teacher = result.scalar_one_or_none()
    if not teacher:
        raise NotFoundException("Teacher profile")
    return teacher


@router.get("/", response_model=list[TeacherOut])
async def list_teachers(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = TeacherService(db)
    return await svc.list_teachers(skip=skip, limit=limit)


@router.post("/", response_model=TeacherOut, status_code=201)
async def create_teacher(
    data: TeacherCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = TeacherService(db)
    return await svc.create_teacher(data)


@router.get("/{teacher_id}", response_model=TeacherOut)
async def get_teacher(
    teacher_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = TeacherService(db)
    return await svc.get_teacher(teacher_id)


@router.put("/{teacher_id}", response_model=TeacherOut)
async def update_teacher(
    teacher_id: str,
    data: TeacherUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = TeacherService(db)
    return await svc.update_teacher(teacher_id, data)


@router.delete("/{teacher_id}", status_code=204)
async def delete_teacher(
    teacher_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = TeacherService(db)
    teacher = await svc.get_teacher(teacher_id)
    from app.repositories.teacher_repo import TeacherRepository
    repo = TeacherRepository(db)
    await repo.delete(teacher)
