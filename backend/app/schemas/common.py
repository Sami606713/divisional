from pydantic import BaseModel
from typing import Generic, TypeVar

T = TypeVar("T")


class PaginatedResponse(BaseModel, Generic[T]):
    items: list[T]
    total: int
    page: int
    per_page: int
    pages: int


class MessageResponse(BaseModel):
    message: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
