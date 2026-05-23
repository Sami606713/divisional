from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.teacher_repo import TeacherRepository
from app.repositories.user_repo import UserRepository
from app.models.user import User, UserRole
from app.models.teacher import Teacher
from app.schemas.teacher import TeacherCreate, TeacherUpdate
from app.core.security import hash_password
from app.exceptions import ConflictException, NotFoundException


class TeacherService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = TeacherRepository(db)
        self.user_repo = UserRepository(db)

    async def create_teacher(self, data: TeacherCreate) -> Teacher:
        if data.email and await self.user_repo.exists_by_email(data.email):
            raise ConflictException("Email already registered")

        user = User(
            name=data.name,
            email=data.email,
            phone=data.phone,
            password_hash=hash_password(data.password),
            role=UserRole.TEACHER,
        )
        await self.user_repo.create(user)

        teacher = Teacher(
            user_id=user.id,
            father_name=data.father_name,
            cnic=data.cnic,
            qualification=data.qualification,
            joining_date=data.joining_date,
            salary=data.salary,
        )
        return await self.repo.create(teacher)

    async def get_teacher(self, teacher_id: str) -> Teacher:
        teacher = await self.repo.get_by_id(teacher_id)
        if not teacher:
            raise NotFoundException("Teacher")
        return teacher

    async def list_teachers(self, skip: int = 0, limit: int = 20) -> list[Teacher]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def update_teacher(self, teacher_id: str, data: TeacherUpdate) -> Teacher:
        teacher = await self.get_teacher(teacher_id)
        return await self.repo.update(teacher, data.model_dump(exclude_none=True))
