from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.fee import FeeStructure, FeeRecord, FeeStatus
from app.repositories.base import BaseRepository


class FeeRepository(BaseRepository[FeeStructure]):
    model = FeeStructure

    def __init__(self, db: AsyncSession) -> None:
        super().__init__(db)

    async def get_structure_by_class(self, class_id: str, session_year: str | None = None) -> list[FeeStructure]:
        stmt = select(FeeStructure).where(FeeStructure.class_id == class_id)
        if session_year:
            stmt = stmt.where(FeeStructure.session_year == session_year)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_records_by_student(self, student_id: str) -> list[FeeRecord]:
        result = await self.db.execute(
            select(FeeRecord).where(FeeRecord.student_id == student_id).order_by(FeeRecord.due_date.desc())
        )
        return list(result.scalars().all())

    async def get_pending_fees(self, student_id: str) -> list[FeeRecord]:
        result = await self.db.execute(
            select(FeeRecord).where(
                FeeRecord.student_id == student_id,
                FeeRecord.status.in_([FeeStatus.PENDING, FeeStatus.PARTIAL, FeeStatus.OVERDUE]),
            )
        )
        return list(result.scalars().all())

    async def generate_receipt_no(self) -> str:
        result = await self.db.execute(select(func.count()).select_from(FeeRecord))
        count = result.scalar_one()
        return f"RCP-{str(count + 1).zfill(6)}"

    async def get_record_by_id(self, id: str) -> FeeRecord | None:
        result = await self.db.execute(select(FeeRecord).where(FeeRecord.id == id))
        return result.scalar_one_or_none()

    async def create_record(self, record: FeeRecord) -> FeeRecord:
        self.db.add(record)
        await self.db.flush()
        await self.db.refresh(record)
        return record
