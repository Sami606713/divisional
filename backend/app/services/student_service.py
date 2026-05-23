from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from app.repositories.student_repo import StudentRepository
from app.repositories.user_repo import UserRepository
from app.models.user import User, UserRole
from app.models.student import Student
from app.schemas.student import StudentCreate, StudentUpdate
from app.core.security import hash_password
from app.exceptions import ConflictException, NotFoundException


class StudentService:
    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.repo = StudentRepository(db)
        self.user_repo = UserRepository(db)

    async def create_student(self, data: StudentCreate) -> Student:
        if data.email and await self.user_repo.exists_by_email(data.email):
            raise ConflictException("Email already registered")
        if data.phone and await self.user_repo.exists_by_phone(data.phone):
            raise ConflictException("Phone number already registered")

        user = User(
            name=data.name,
            email=data.email,
            phone=data.phone,
            password_hash=hash_password(data.password),
            role=UserRole.STUDENT,
        )
        try:
            await self.user_repo.create(user)
        except IntegrityError as e:
            detail = str(e.orig)
            if "phone" in detail:
                raise ConflictException("Phone number already registered")
            if "email" in detail:
                raise ConflictException("Email already registered")
            raise ConflictException("Duplicate entry — check email or phone")

        roll_number = await self.repo.generate_roll_number(data.session_year)
        student = Student(
            user_id=user.id,
            roll_number=roll_number,
            father_name=data.father_name,
            date_of_birth=data.date_of_birth,
            gender=data.gender,
            cnic_or_bform=data.cnic_or_bform,
            address=data.address,
            session_year=data.session_year,
            class_id=data.class_id,
            parent_id=data.parent_id,
        )
        created = await self.repo.create(student)
        return await self.repo.get_by_id(created.id)

    async def get_student(self, student_id: str) -> Student:
        student = await self.repo.get_by_id(student_id)
        if not student:
            raise NotFoundException("Student")
        return student

    async def list_students(self, skip: int = 0, limit: int = 20) -> list[Student]:
        return await self.repo.get_all(skip=skip, limit=limit)

    async def update_student(self, student_id: str, data: StudentUpdate) -> Student:
        student = await self.get_student(student_id)
        return await self.repo.update(student, data.model_dump(exclude_none=True))

    async def deactivate_student(self, student_id: str) -> Student:
        student = await self.get_student(student_id)
        user = await self.user_repo.get_by_id(student.user_id)
        if user:
            await self.user_repo.update(user, {"is_active": False})
        return await self.repo.update(student, {"is_active": False})
