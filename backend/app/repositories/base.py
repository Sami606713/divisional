from typing import Any, Generic, TypeVar
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import Base

ModelT = TypeVar("ModelT", bound=Base)


class BaseRepository(Generic[ModelT]):
    model: type[ModelT]

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_by_id(self, id: str) -> ModelT | None:
        result = await self.db.execute(select(self.model).where(self.model.id == id))
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 20) -> list[ModelT]:
        result = await self.db.execute(select(self.model).offset(skip).limit(limit))
        return list(result.scalars().all())

    async def create(self, obj: ModelT) -> ModelT:
        self.db.add(obj)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def update(self, obj: ModelT, data: dict[str, Any]) -> ModelT:
        for key, value in data.items():
            if value is not None:
                setattr(obj, key, value)
        await self.db.flush()
        await self.db.refresh(obj)
        return obj

    async def delete(self, obj: ModelT) -> None:
        await self.db.delete(obj)
        await self.db.flush()

    async def count(self) -> int:
        result = await self.db.execute(select(func.count()).select_from(self.model))
        return result.scalar_one()
