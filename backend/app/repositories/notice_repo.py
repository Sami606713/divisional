from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notice import Notice, NoticeType
from app.repositories.base import BaseRepository


class NoticeRepository(BaseRepository[Notice]):
    model = Notice

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_pinned(self) -> list[Notice]:
        result = await self.db.execute(
            select(Notice).where(Notice.is_pinned == True).order_by(Notice.published_at.desc())  # noqa: E712
        )
        return list(result.scalars().all())

    async def get_by_type(self, notice_type: NoticeType) -> list[Notice]:
        result = await self.db.execute(
            select(Notice).where(Notice.notice_type == notice_type).order_by(Notice.published_at.desc())
        )
        return list(result.scalars().all())

    async def get_paginated(self, skip: int = 0, limit: int = 20) -> list[Notice]:
        result = await self.db.execute(
            select(Notice).order_by(Notice.published_at.desc()).offset(skip).limit(limit)
        )
        return list(result.scalars().all())
