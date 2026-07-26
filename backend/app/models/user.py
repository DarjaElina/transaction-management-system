from typing import TYPE_CHECKING
import uuid

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from .transaction import Transaction
    from .category import Category


class UserBase(SQLModel):
    email: str = Field(index=True, sa_column_kwargs={"unique": True})
    first_name: str
    last_name: str
    disabled: bool = False

    __tablename__: str = "users"  # type: ignore


class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    password_hash: str
    transactions: list["Transaction"] = Relationship(back_populates="user")
    categories: list["Category"] = Relationship(back_populates="user")
