from decimal import Decimal

from sqlmodel import Field, SQLModel, Column, Enum, Relationship
from datetime import datetime
from pydantic import ConfigDict
from .enums import TransactionType
from .category import Category


class TransactionBase(SQLModel):
    date: datetime = Field(index=True)
    description: str
    amount: Decimal = Field(gt=0, max_digits=19, decimal_places=2)
    transaction_type: TransactionType = Field(
        sa_column=Column(Enum(TransactionType), nullable=False)
    )
    category_id: int | None = Field(default=None, foreign_key="categories.id")

    __tablename__ = "transactions"


class Transaction(TransactionBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    category: Category = Relationship(back_populates="transactions")


class TransactionPublic(TransactionBase):
    id: int


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(extra="forbid")


class TransactionUpdate(TransactionBase):
    model_config = ConfigDict(extra="forbid")

    date: datetime | None = None
    description: str | None = None
    category_id: str | None = None
    amount: Decimal | None = None
    transaction_type: TransactionType | None = None
