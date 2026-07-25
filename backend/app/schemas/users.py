import uuid

from pydantic import ConfigDict
from sqlmodel import SQLModel

from app.models.user import UserBase


class UserPublic(UserBase):
    id: uuid.UUID


class UserCreate(SQLModel):
    email: str
    first_name: str
    last_name: str
    password: str

    model_config = ConfigDict(extra="forbid")  # type: ignore
