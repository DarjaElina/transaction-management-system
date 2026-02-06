from pydantic import BaseModel, PastDate

class Transaction(BaseModel):
  id: int
  date: PastDate
  description: str
  category: str
  amount: float