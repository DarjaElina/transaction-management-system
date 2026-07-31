from datetime import datetime

from fastapi import APIRouter

from app.db.database import SessionDep
from app.services import statistics
from app.schemas.statistics import (
    FinancialSummary,
    IncomeExpenseOverview,
    SpendingByCategory,
)
from app.dependencies import CurrentUser

router = APIRouter(prefix="/statistics")


@router.get("/income-expense", response_model=list[IncomeExpenseOverview])
def get_income_expense_overview(
    session: SessionDep,
    user: CurrentUser,
    start: datetime,
    end: datetime,
    period: str,
    user_timezone: str,
):
    stats = statistics.get_income_expense_overview(
        session, start, end, period, user_timezone
    )
    return stats


@router.get("/spending-by-category", response_model=list[SpendingByCategory])
def get_spending_by_category(
    session: SessionDep,
    user: CurrentUser,
    start: datetime,
    end: datetime,
):
    stats = statistics.get_spending_by_category(session, start, end)
    return stats


@router.get("/financial-summary", response_model=FinancialSummary)
def get_financial_summary(session: SessionDep, user: CurrentUser, user_timezone: str):
    stats = statistics.get_financial_summary(session, user_timezone)
    return stats
