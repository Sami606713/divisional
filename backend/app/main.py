from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import get_logger
from app.exceptions import register_exception_handlers
from app.api.v1.router import api_router

logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting %s v%s [%s]", settings.APP_NAME, settings.APP_VERSION, settings.ENVIRONMENT)
    yield
    logger.info("Shutting down %s", settings.APP_NAME)


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.ALLOWED_ORIGINS if settings.ENVIRONMENT != "development" else ["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    register_exception_handlers(app)

    app.include_router(api_router, prefix="/api/v1")

    @app.get("/health", tags=["health"])
    async def health():
        return {"status": "ok", "version": settings.APP_VERSION}

    return app


app = create_app()
