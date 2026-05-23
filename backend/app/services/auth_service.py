from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repo import UserRepository
from app.core.security import verify_password, hash_password, create_access_token, create_refresh_token, decode_token
from app.exceptions import BadRequestException, NotFoundException, ConflictException
from app.schemas.user import LoginRequest, RegisterRequest
from app.models.user import User


class TokenResponse:
    def __init__(self, access_token: str, refresh_token: str, role: str, user_id: str = "", name: str = "", token_type: str = "bearer"):
        self.access_token = access_token
        self.refresh_token = refresh_token
        self.role = role
        self.user_id = user_id
        self.name = name
        self.token_type = token_type


class AuthService:
    def __init__(self, db: AsyncSession) -> None:
        self.repo = UserRepository(db)

    async def login(self, data: LoginRequest) -> TokenResponse:
        user = await self.repo.get_by_email(data.credential)
        if not user:
            user = await self.repo.get_by_phone(data.credential)
        if not user:
            user = await self.repo.get_by_roll_number(data.credential)
        if not user:
            raise BadRequestException("Invalid credentials")
        if not user.is_active:
            raise BadRequestException("Account is inactive")
        if not verify_password(data.password, user.password_hash):
            raise BadRequestException("Invalid credentials")
        access = create_access_token(user.id, {"role": user.role})
        refresh = create_refresh_token(user.id)
        return TokenResponse(access_token=access, refresh_token=refresh, role=user.role.value, user_id=user.id, name=user.name)

    async def register(self, data: RegisterRequest) -> TokenResponse:
        if await self.repo.exists_by_email(data.email):
            raise ConflictException("Email already registered")
        if data.phone and await self.repo.get_by_phone(data.phone):
            raise ConflictException("Phone number already registered")
        user = User(
            name=data.name,
            email=data.email,
            phone=data.phone,
            password_hash=hash_password(data.password),
            role=data.role,
        )
        await self.repo.create(user)
        access = create_access_token(user.id, {"role": user.role})
        refresh = create_refresh_token(user.id)
        return TokenResponse(access_token=access, refresh_token=refresh, role=user.role.value, user_id=user.id, name=user.name)

    async def refresh_token(self, token: str) -> TokenResponse:
        try:
            payload = decode_token(token)
        except ValueError:
            raise BadRequestException("Invalid refresh token")
        if payload.get("type") != "refresh":
            raise BadRequestException("Not a refresh token")
        user = await self.repo.get_by_id(payload["sub"])
        if not user or not user.is_active:
            raise NotFoundException("User")
        access = create_access_token(user.id, {"role": user.role})
        new_refresh = create_refresh_token(user.id)
        return TokenResponse(access_token=access, refresh_token=new_refresh, role=user.role.value, name=user.name)

    async def change_password(self, user_id: str, old_pw: str, new_pw: str) -> None:
        user = await self.repo.get_by_id(user_id)
        if not user:
            raise NotFoundException("User")
        if not verify_password(old_pw, user.password_hash):
            raise BadRequestException("Current password is incorrect")
        await self.repo.update(user, {"password_hash": hash_password(new_pw)})
