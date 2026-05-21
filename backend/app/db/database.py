from typing import Annotated
from sqlmodel import Session, create_engine
from fastapi import Depends
from app.config import get_settings
from functools import lru_cache


settings = get_settings()


@lru_cache
def get_engine():
    return create_engine(
        settings.database_url,
        echo=True,
    )


def get_session():
    with Session(get_engine()) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
