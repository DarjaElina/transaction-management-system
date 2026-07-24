from datetime import datetime

from fastapi import APIRouter

from app.db.database import SessionDep
from app.services import statistics_service
from app.schemas.statistics import (
    FinancialSummary,
    IncomeExpenseOverview,
    SpendingByCategory,
)

router = APIRouter(prefix="/statistics")


@router.get("/income-expense", response_model=list[IncomeExpenseOverview])
def get_income_expense_overview(
    session: SessionDep, start: datetime, end: datetime, period: str, user_timezone: str
):
    stats = statistics_service.get_income_expense_overview(
        session, start, end, period, user_timezone
    )
    return stats


@router.get("/spending-by-category", response_model=list[SpendingByCategory])
def get_spending_by_category(
    session: SessionDep,
    start: datetime,
    end: datetime,
):
    stats = statistics_service.get_spending_by_category(session, start, end)
    return stats


@router.get("/financial-summary", response_model=FinancialSummary)
def get_financial_summary(session: SessionDep, user_timezone: str):
    stats = statistics_service.get_financial_summary(session, user_timezone)
    return stats
