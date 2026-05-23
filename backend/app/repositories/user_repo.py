from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User
from app.repositories.base import BaseRepository


class UserRepository(BaseRepository[User]):
    model = User

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def get_by_phone(self, phone: str) -> User | None:
        result = await self.db.execute(select(User).where(User.phone == phone))
        return result.scalar_one_or_none()

    async def exists_by_email(self, email: str) -> bool:
        result = await self.db.execute(select(User.id).where(User.email == email))
        return result.scalar_one_or_none() is not None
