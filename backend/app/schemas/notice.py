from pydantic import BaseModel
from app.models.notice import NoticeType
from datetime import datetime


class NoticeCreate(BaseModel):
    title: str
    body: str
    notice_type: NoticeType
    attachment: str | None = None
    is_pinned: bool = False
    published_at: datetime


class NoticeOut(BaseModel):
    id: str
    title: str
    body: str
    notice_type: NoticeType
    is_pinned: bool
    published_at: datetime
    created_at: datetime

    model_config = {"from_attributes": True}
