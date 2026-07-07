from datetime import datetime

from fastapi import APIRouter

from app.db.database import SessionDep
from app.services import statistics_service
from app.schemas.statistics import IncomeExpenseOverview

router = APIRouter(prefix="/statistics")


@router.get("/income-expense", response_model=list[IncomeExpenseOverview])
def get_income_expense_overview(
    session: SessionDep,
    start: datetime,
    end: datetime,
    period: str,
):
    stats = statistics_service.get_income_expense_overview(session, start, end, period)
    return stats
