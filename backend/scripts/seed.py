"""
Seed script: creates admin, 5 classes, 3 teachers, 10 students, sample notices.
Run with:  uv run python scripts/seed.py
"""
import asyncio
import datetime
from app.database import AsyncSessionLocal
from app.models.user import User, UserRole
from app.models.class_ import Class
from app.models.subject import Subject
from app.models.teacher import Teacher
from app.models.student import Student, Gender
from app.models.notice import Notice, NoticeType
from app.core.security import hash_password


async def seed():
    async with AsyncSessionLocal() as db:
        # Admin user
        admin = User(
            name="Admin User",
            email="admin@dphs.edu.pk",
            password_hash=hash_password("Admin@1234"),
            role=UserRole.ADMIN,
        )
        db.add(admin)
        await db.flush()

        # 5 classes (6th–10th)
        classes = []
        for grade in range(6, 11):
            cls = Class(name=str(grade), section="A", session_year="2024-2025", capacity=45)
            db.add(cls)
            await db.flush()
            classes.append(cls)

            # Seed a few standard subjects per class so timetable and marks screens have data.
            for subject_name, code in [
                ("English", "ENG"),
                ("Mathematics", "MTH"),
                ("Science", "SCI"),
                ("Urdu", "URD"),
            ]:
                db.add(Subject(name=subject_name, code=code, class_id=cls.id))

        # 3 teachers
        teachers = []
        teacher_data = [
            {"name": "Mr. Arshad Ali", "email": "arshad@dphs.edu.pk", "qualification": "M.Sc Physics"},
            {"name": "Ms. Sana Bibi", "email": "sana@dphs.edu.pk", "qualification": "M.A Urdu"},
            {"name": "Mr. Khalid Mehmood", "email": "khalid@dphs.edu.pk", "qualification": "M.Sc Math"},
        ]
        for td in teacher_data:
            user = User(
                name=td["name"],
                email=td["email"],
                password_hash=hash_password("Teacher@1234"),
                role=UserRole.TEACHER,
            )
            db.add(user)
            await db.flush()
            teacher = Teacher(
                user_id=user.id,
                qualification=td["qualification"],
                joining_date=datetime.date(2020, 1, 1),
                salary=25000.0,
            )
            db.add(teacher)
            await db.flush()
            teachers.append(teacher)

        # 10 students (2 per class)
        for i, cls in enumerate(classes):
            for j in range(2):
                idx = i * 2 + j + 1
                user = User(
                    name=f"Student {idx}",
                    email=f"student{idx}@dphs.edu.pk",
                    password_hash=hash_password("Student@1234"),
                    role=UserRole.STUDENT,
                )
                db.add(user)
                await db.flush()
                student = Student(
                    user_id=user.id,
                    roll_number=f"2024-{str(idx).zfill(3)}",
                    father_name=f"Father of Student {idx}",
                    gender=Gender.MALE if idx % 2 == 0 else Gender.FEMALE,
                    session_year="2024-2025",
                    class_id=cls.id,
                    is_active=True,
                )
                db.add(student)
                await db.flush()

        # Sample notices
        for title, ntype in [
            ("Welcome to New Session 2024-2025", NoticeType.GENERAL),
            ("Fee Submission Reminder", NoticeType.FEE),
            ("Annual Examination Schedule", NoticeType.EXAM),
        ]:
            notice = Notice(
                title=title,
                body=f"This is a sample notice: {title}",
                notice_type=ntype,
                is_pinned=ntype == NoticeType.GENERAL,
                published_at=datetime.datetime.now(datetime.timezone.utc),
                created_by_id=admin.id,
            )
            db.add(notice)

        await db.commit()
        print("Seed completed successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
