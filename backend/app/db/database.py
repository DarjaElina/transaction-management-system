from typing import Annotated
from sqlmodel import Session, create_engine
from fastapi import Depends

SQLITE_FILE_NAME = "transactions.db"

DATABASE_URL = f"sqlite:///{SQLITE_FILE_NAME}"

engine = create_engine(
    DATABASE_URL,
    echo=True,
    connect_args={"check_same_thread": False},
)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
