from decimal import Decimal
from datetime import datetime
from sqlmodel import Field, SQLModel, Column, Enum, Relationship
from sqlalchemy import DateTime
from ..core.enums import TransactionType
from .category import Category
import uuid


class TransactionBase(SQLModel):
    date: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, index=True)
    )
    description: str
    amount: Decimal = Field(gt=0, max_digits=19, decimal_places=2)
    transaction_type: TransactionType = Field(
        sa_column=Column(Enum(TransactionType), nullable=False)
    )
    category_id: uuid.UUID | None = Field(default=None, foreign_key="categories.id")

    __tablename__ = "transactions"


class Transaction(TransactionBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    category: Category = Relationship(back_populates="transactions")
