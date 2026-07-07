from sqlmodel import Field, SQLModel, Column, Relationship
from app.core.enums import TransactionType
from sqlalchemy.dialects import postgresql
from typing import TYPE_CHECKING
import uuid

if TYPE_CHECKING:
    from .transaction import Transaction


class CategoryBase(SQLModel):
    name: str = Field(index=True, sa_column_kwargs={"unique": True})
    description: str | None = Field(default=None)
    allowed_type: TransactionType = Field(
        sa_column=Column(
            postgresql.ENUM(TransactionType, create_type=False), nullable=False
        )
    )
    is_active: bool = Field(default=True)

    __tablename__: str = "categories"  # type: ignore


class Category(CategoryBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    transactions: list["Transaction"] = Relationship(back_populates="category")
