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


class Change(BaseModel):
    current: Decimal | None
    previous: Decimal | None
    change: Decimal | None


class MonthlyOverview(BaseModel):
    income: Change
    expense: Change
