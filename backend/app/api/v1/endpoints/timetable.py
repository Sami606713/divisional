from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.timetable import Timetable
from app.schemas.timetable import TimetableCreate, TimetableOut
from app.dependencies import get_current_user
from app.exceptions import NotFoundException

router = APIRouter()


@router.get("/class/{class_id}", response_model=list[TimetableOut])
async def get_class_timetable(
    class_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(Timetable).where(Timetable.class_id == class_id).order_by(Timetable.day, Timetable.period)
    )
    return result.scalars().all()


@router.get("/teacher/{teacher_id}", response_model=list[TimetableOut])
async def get_teacher_timetable(
    teacher_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(
        select(Timetable).where(Timetable.teacher_id == teacher_id).order_by(Timetable.day, Timetable.period)
    )
    return result.scalars().all()


@router.post("/", response_model=TimetableOut, status_code=201)
async def create_timetable_entry(
    data: TimetableCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    entry = Timetable(
        class_id=data.class_id,
        subject_id=data.subject_id,
        teacher_id=data.teacher_id,
        day=data.day,
        period=data.period,
        start_time=data.start_time,
        end_time=data.end_time,
    )
    db.add(entry)
    await db.flush()
    await db.refresh(entry)
    return entry


@router.delete("/{entry_id}", status_code=204)
async def delete_timetable_entry(
    entry_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Timetable).where(Timetable.id == entry_id))
    entry = result.scalar_one_or_none()
    if not entry:
        raise NotFoundException("Timetable entry")
    await db.delete(entry)
