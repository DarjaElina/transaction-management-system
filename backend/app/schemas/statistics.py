from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal


class IncomeExpenseOverview(BaseModel):
    label: datetime | None
    income: Decimal | None
    expense: Decimal | None


class SpendingByCategory(BaseModel):
    category: str | None
    amount: Decimal | None
