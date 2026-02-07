from sqlmodel import Field, SQLModel

class Transaction(SQLModel, table=True):
  id: int | None = Field(default=None, primary_key=True)
  date: str = Field(index=True)
  description: str
  category: str = Field(index = True)
  amount: float