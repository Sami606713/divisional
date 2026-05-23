import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.fee_repo import FeeRepository
from app.repositories.student_repo import StudentRepository
from app.models.fee import FeeStructure, FeeRecord, FeeStatus
from app.schemas.fee import FeeStructureCreate, FeePaymentCreate
from app.exceptions import NotFoundException


class FeeService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = FeeRepository(db)
        self.student_repo = StudentRepository(db)

    async def create_structure(self, data: FeeStructureCreate) -> FeeStructure:
        structure = FeeStructure(
            class_id=data.class_id,
            fee_type=data.fee_type,
            amount=data.amount,
            session_year=data.session_year,
            due_day=data.due_day,
            late_fine=data.late_fine,
        )
        return await self.repo.create(structure)

    async def record_payment(self, data: FeePaymentCreate) -> FeeRecord:
        student = await self.student_repo.get_by_id(data.student_id)
        if not student:
            raise NotFoundException("Student")

        receipt_no = await self.repo.generate_receipt_no()
        month_parts = data.month.split("-")
        year, month_num = int(month_parts[0]), int(month_parts[1])
        due_date = datetime.date(year, month_num, 10)

        net = data.paid_amount
        status = FeeStatus.PAID

        record = FeeRecord(
            student_id=data.student_id,
            fee_type=data.fee_type,
            month=data.month,
            amount=net,
            net_amount=net,
            paid_amount=data.paid_amount,
            status=status,
            due_date=due_date,
            paid_date=datetime.date.today(),
            payment_method=data.payment_method,
            receipt_no=receipt_no,
            remarks=data.remarks,
        )
        return await self.repo.create_record(record)

    async def get_student_fees(self, student_id: str) -> list[FeeRecord]:
        student = await self.student_repo.get_by_id(student_id)
        if not student:
            raise NotFoundException("Student")
        return await self.repo.get_records_by_student(student_id)

    async def get_collection_summary(self, student_id: str) -> dict:
        records = await self.repo.get_records_by_student(student_id)
        total_paid = sum(r.paid_amount for r in records if r.status == FeeStatus.PAID)
        total_pending = sum(r.net_amount - r.paid_amount for r in records if r.status != FeeStatus.PAID)
        return {"total_paid": total_paid, "total_pending": total_pending, "records_count": len(records)}
