from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.models.subject import Subject
from app.dependencies import get_current_user

router = APIRouter()


class SubjectOut(BaseModel):
    id: str
    name: str
    code: str | None
    class_id: str
    teacher_id: str | None

    model_config = {"from_attributes": True}


class SubjectCreate(BaseModel):
    name: str
    code: str | None = None
    class_id: str
    teacher_id: str | None = None


class SubjectUpdate(BaseModel):
    name: str | None = None
    code: str | None = None
    class_id: str | None = None
    teacher_id: str | None = None


@router.get("/", response_model=list[SubjectOut])
async def list_subjects(
    class_id: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    q = select(Subject)
    if class_id:
        q = q.where(Subject.class_id == class_id)
    result = await db.execute(q)
    return result.scalars().all()


@router.post("/", response_model=SubjectOut, status_code=201)
async def create_subject(
    data: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    subject = Subject(name=data.name, code=data.code, class_id=data.class_id, teacher_id=data.teacher_id)
    db.add(subject)
    await db.flush()
    await db.refresh(subject)
    await db.commit()
    return subject


@router.get("/{subject_id}", response_model=SubjectOut)
async def get_subject(
    subject_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subject = result.scalar_one_or_none()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    return subject


@router.put("/{subject_id}", response_model=SubjectOut)
async def update_subject(
    subject_id: str,
    data: SubjectUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subject = result.scalar_one_or_none()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(subject, field, value)
    await db.flush()
    await db.refresh(subject)
    await db.commit()
    return subject


@router.delete("/{subject_id}", status_code=204)
async def delete_subject(
    subject_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    result = await db.execute(select(Subject).where(Subject.id == subject_id))
    subject = result.scalar_one_or_none()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    await db.delete(subject)
    await db.commit()
