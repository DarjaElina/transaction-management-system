from decimal import Decimal

from sqlmodel import Field, SQLModel, Column, Enum
from datetime import datetime
from .enums import TransactionType


class TransactionBase(SQLModel):
    date: datetime = Field(index=True)
    description: str
    category: str = Field(index=True)
    amount: Decimal = Field(gt=0, max_digits=19, decimal_places=2)
    transaction_type: TransactionType = Field(
        sa_column=Column(Enum(TransactionType), nullable=False)
    )

    __tablename__ = "transactions"


class Transaction(
    TransactionBase, table=True
):  # when we create a class that inherits from SQLModel and has table=True, it is registered in `metadata` attribute.
    id: int | None = Field(default=None, primary_key=True)


class TransactionPublic(TransactionBase):
    id: int


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(TransactionBase):
    date: datetime | None = None
    description: str | None = None
    category: str | None = None
    amount: Decimal | None = None
    transaction_type: TransactionType | None = None
