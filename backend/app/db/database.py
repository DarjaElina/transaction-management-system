from typing import Annotated
from sqlmodel import Session, create_engine
from fastapi import Depends
from app.config import Settings
from functools import lru_cache


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
engine = create_engine(
    settings.database_url,
    echo=True,
)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
