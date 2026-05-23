from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.notice_service import NoticeService
from app.schemas.notice import NoticeCreate, NoticeOut
from app.dependencies import get_current_user

router = APIRouter()


@router.get("/", response_model=list[NoticeOut])
async def list_notices(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = NoticeService(db)
    return await svc.list_notices(skip=skip, limit=limit)


@router.post("/", response_model=NoticeOut, status_code=201)
async def create_notice(
    data: NoticeCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    svc = NoticeService(db)
    return await svc.create_notice(data, current_user.id)


@router.get("/{notice_id}", response_model=NoticeOut)
async def get_notice(
    notice_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = NoticeService(db)
    return await svc.get_notice(notice_id)


@router.put("/{notice_id}", response_model=NoticeOut)
async def update_notice(
    notice_id: str,
    data: NoticeCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = NoticeService(db)
    return await svc.update_notice(notice_id, data.model_dump(exclude_none=True))


@router.delete("/{notice_id}", status_code=204)
async def delete_notice(
    notice_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_user),
):
    svc = NoticeService(db)
    await svc.delete_notice(notice_id)
