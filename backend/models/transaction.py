from sqlmodel import Field, SQLModel
from datetime import datetime

class TransactionBase(SQLModel):
  date: datetime = Field(index=True)
  description: str
  category: str = Field(index=True)
  amount: float

  __tablename__ = "transactions"

class Transaction(TransactionBase, table=True): # when we create a class that inherits from SQLModel and has table=True, it is registered in `metadata` attribute.
  id: int | None = Field(default=None, primary_key=True)

class TransactionPublic(TransactionBase):
  id: int

class TransactionCreate(TransactionBase):
  pass

class TransactionUpdate(TransactionBase):
  description: str | None = None
  category: str | None = None
  amount: float | None = None