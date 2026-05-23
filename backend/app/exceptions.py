from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AppException(Exception):
    def __init__(self, status_code: int, detail: str):
        self.status_code = status_code
        self.detail = detail


class NotFoundException(AppException):
    def __init__(self, resource: str = "Resource"):
        super().__init__(404, f"{resource} not found")


class ConflictException(AppException):
    def __init__(self, detail: str = "Resource already exists"):
        super().__init__(409, detail)


class BadRequestException(AppException):
    def __init__(self, detail: str):
        super().__init__(400, detail)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
