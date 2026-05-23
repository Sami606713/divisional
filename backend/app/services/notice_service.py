from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.notice_repo import NoticeRepository
from app.models.notice import Notice, NoticeType
from app.schemas.notice import NoticeCreate
from app.exceptions import NotFoundException


class NoticeService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = NoticeRepository(db)

    async def create_notice(self, data: NoticeCreate, created_by_id: str) -> Notice:
        notice = Notice(
            title=data.title,
            body=data.body,
            notice_type=data.notice_type,
            attachment=data.attachment,
            is_pinned=data.is_pinned,
            published_at=data.published_at,
            created_by_id=created_by_id,
        )
        return await self.repo.create(notice)

    async def list_notices(self, skip: int = 0, limit: int = 20) -> list[Notice]:
        return await self.repo.get_paginated(skip=skip, limit=limit)

    async def get_notice(self, notice_id: str) -> Notice:
        notice = await self.repo.get_by_id(notice_id)
        if not notice:
            raise NotFoundException("Notice")
        return notice

    async def update_notice(self, notice_id: str, data: dict) -> Notice:
        notice = await self.get_notice(notice_id)
        return await self.repo.update(notice, data)

    async def delete_notice(self, notice_id: str) -> None:
        notice = await self.get_notice(notice_id)
        await self.repo.delete(notice)
