from fastapi import APIRouter, Depends, Query
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.class_ import Class
from app.models.student import Student
from app.schemas.class_ import ClassCreate, ClassUpdate, ClassOut
from app.dependencies import get_current_user
from app.exceptions import NotFoundException

router = APIRouter()


@router.get("/", response_model=list[ClassOut])
async def list_classes(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, le=200),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Class).offset(skip).limit(limit))
    classes = result.scalars().all()
    out = []
    for c in classes:
        cnt_result = await db.execute(
            select(func.count()).select_from(Student).where(Student.class_id == c.id)
        )
        count = cnt_result.scalar_one()
        obj = ClassOut.model_validate(c)
        obj.student_count = count
        out.append(obj)
    return out


@router.post("/", response_model=ClassOut, status_code=201)
async def create_class(
    data: ClassCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    school_class = Class(
        name=data.name,
        section=data.section,
        session_year=data.session_year,
        capacity=data.capacity,
        class_teacher_id=data.class_teacher_id,
    )
    db.add(school_class)
    await db.flush()
    await db.refresh(school_class)
    obj = ClassOut.model_validate(school_class)
    obj.student_count = 0
    return obj


@router.put("/{class_id}", response_model=ClassOut)
async def update_class(
    class_id: str,
    data: ClassUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Class).where(Class.id == class_id))
    school_class = result.scalar_one_or_none()
    if not school_class:
        raise NotFoundException("Class")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(school_class, field, value)
    await db.flush()
    await db.refresh(school_class)
    cnt_result = await db.execute(
        select(func.count()).select_from(Student).where(Student.class_id == class_id)
    )
    count = cnt_result.scalar_one()
    obj = ClassOut.model_validate(school_class)
    obj.student_count = count
    await db.commit()
    return obj


@router.delete("/{class_id}", status_code=204)
async def delete_class(
    class_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Class).where(Class.id == class_id))
    school_class = result.scalar_one_or_none()
    if not school_class:
        raise NotFoundException("Class")
    await db.delete(school_class)
    await db.commit()


@router.get("/{class_id}", response_model=ClassOut)
async def get_class(
    class_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Class).where(Class.id == class_id))
    school_class = result.scalar_one_or_none()
    if not school_class:
        raise NotFoundException("Class")
    cnt_result = await db.execute(
        select(func.count()).select_from(Student).where(Student.class_id == class_id)
    )
    count = cnt_result.scalar_one()
    obj = ClassOut.model_validate(school_class)
    obj.student_count = count
    return obj
