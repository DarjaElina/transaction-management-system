import uuid

from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    email: str = Field(index=True, sa_column_kwargs={"unique": True})
    first_name: str
    last_name: str
    disabled: bool = False

    __tablename__: str = "users"  # type: ignore


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
