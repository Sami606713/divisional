from pydantic import BaseModel
from app.models.fee import FeeType, FeeStatus
from datetime import date


class FeeStructureCreate(BaseModel):
    class_id: str
    fee_type: FeeType
    amount: float
    session_year: str
    due_day: int = 10
    late_fine: float = 0.0


class FeeStructureOut(BaseModel):
    id: str
    class_id: str
    fee_type: FeeType
    amount: float
    session_year: str
    due_day: int

    model_config = {"from_attributes": True}


class FeePaymentCreate(BaseModel):
    student_id: str
    fee_type: FeeType
    month: str
    paid_amount: float
    payment_method: str
    remarks: str | None = None


class FeeRecordOut(BaseModel):
    id: str
    student_id: str
    fee_type: FeeType
    month: str
    amount: float
    net_amount: float
    paid_amount: float
    status: FeeStatus
    due_date: date
    paid_date: date | None
    receipt_no: str | None

    model_config = {"from_attributes": True}
