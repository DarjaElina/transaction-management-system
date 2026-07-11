from datetime import datetime
from app.db.database import SessionDep
from sqlmodel import func, case, between, select, type_coerce, TIMESTAMP
from app.models.transaction import Transaction

interval_dict = {"day": "1 day", "week": "1 week", "month": "1 month", "year": "1 year"}


def get_income_expense_overview(
    session: SessionDep, start: datetime, end: datetime, period: str, user_timezone: str
):
    income_case = case(
        (Transaction.transaction_type == "income", Transaction.amount), else_=0
    )
    expense_case = case(
        (Transaction.transaction_type == "expense", Transaction.amount), else_=0
    )

    tz_aware_date = type_coerce(Transaction.date, TIMESTAMP).op("AT TIME ZONE")(
        user_timezone
    )

    series_start = func.date_trunc(period, start)
    series_end = func.date_trunc(period, end)

    empty_periods_cte = select(
        func.generate_series(
            series_start,
            series_end,
            interval_dict[period],
        ).label("period")
    ).subquery("empty_periods_cte")

    periods_cte = (
        select(
            func.date_trunc(period, tz_aware_date).label("date"),
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expense"),
        )
        .where(between(Transaction.date, start, end))
        .group_by(func.date_trunc(period, tz_aware_date))
        .subquery("periods_cte")
    )

    stmt = select(
        empty_periods_cte.c.period.label("label"),
        func.coalesce(periods_cte.c.income, 0).label("income"),
        func.coalesce(periods_cte.c.expense, 0).label("expense"),
    ).join(
        periods_cte,
        isouter=True,
        onclause=empty_periods_cte.c.period == periods_cte.c.date,
    )

    result = session.exec(stmt).all()

    return result
