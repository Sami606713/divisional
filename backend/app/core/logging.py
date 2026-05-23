import logging
import sys
from app.core.config import settings

LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"


def setup_logging() -> None:
    level = logging.DEBUG if settings.DEBUG else logging.INFO
    logging.basicConfig(
        level=level,
        format=LOG_FORMAT,
        handlers=[
            logging.StreamHandler(sys.stdout),
        ],
    )
    # Silence noisy third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    return logging.getLogger(name)
