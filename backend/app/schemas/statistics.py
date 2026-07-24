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
    current: Decimal
    previous: Decimal
    change: Decimal | None


class FinancialSummary(BaseModel):
    income: Change
    expense: Change
    cash_flow: Change
    savings_rate: Change


class MonthlyTotals(BaseModel):
    month: datetime
    income: Decimal
    expense: Decimal
