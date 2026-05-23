from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, teachers, classes, attendance, exams, fees, notices, timetable, subjects

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(teachers.router, prefix="/teachers", tags=["teachers"])
api_router.include_router(classes.router, prefix="/classes", tags=["classes"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(exams.router, prefix="/exams", tags=["exams"])
api_router.include_router(fees.router, prefix="/fees", tags=["fees"])
api_router.include_router(notices.router, prefix="/notices", tags=["notices"])
api_router.include_router(timetable.router, prefix="/timetable", tags=["timetable"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["subjects"])
