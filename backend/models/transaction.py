from sqlmodel import Field, SQLModel

class Transaction(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  date: str
  description: str
  category: str
  amount: float