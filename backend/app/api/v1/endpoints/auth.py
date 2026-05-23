from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.database import get_db
from app.services.auth_service import AuthService
from app.schemas.user import LoginRequest, ChangePasswordRequest, RegisterRequest
from app.dependencies import get_current_user

router = APIRouter()


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str
    user_id: str = ""
    name: str = ""


class RefreshRequest(BaseModel):
    refresh_token: str


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    result = await svc.register(data)
    return TokenResponse(access_token=result.access_token, refresh_token=result.refresh_token, role=result.role, user_id=result.user_id, name=result.name)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    result = await svc.login(data)
    return TokenResponse(access_token=result.access_token, refresh_token=result.refresh_token, role=result.role, user_id=result.user_id, name=result.name)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    svc = AuthService(db)
    result = await svc.refresh_token(data.refresh_token)
    return TokenResponse(access_token=result.access_token, refresh_token=result.refresh_token, role=result.role, user_id=result.user_id, name=result.name)


@router.post("/change-password", status_code=204)
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user),
):
    svc = AuthService(db)
    await svc.change_password(current_user.id, data.current_password, data.new_password)
