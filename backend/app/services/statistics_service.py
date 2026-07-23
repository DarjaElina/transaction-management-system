from datetime import datetime
from decimal import Decimal
from zoneinfo import ZoneInfo

from sqlalchemy import VARCHAR
from app.db.database import SessionDep
from sqlmodel import func, case, between, select, text, type_coerce, TIMESTAMP
from app.models.transaction import Transaction
from app.models.category import Category
from app.core.enums import TransactionType
from app.schemas.statistics import FinancialSummary, MonthlyTotals
from app.services.helpers import calculate_cash_flow, calculate_savings_rate, to_change

interval_dict = {"day": "1 day", "week": "1 week", "month": "1 month", "year": "1 year"}


def get_income_expense_overview(
    session: SessionDep, start: datetime, end: datetime, period: str, user_timezone: str
):
    income_case = case(
        (Transaction.transaction_type == TransactionType.INCOME, Transaction.amount),
        else_=0,
    )
    expense_case = case(
        (Transaction.transaction_type == TransactionType.EXPENSE, Transaction.amount),
        else_=0,
    )

    transaction_date_local = type_coerce(Transaction.date, TIMESTAMP).op(
        "AT TIME ZONE"
    )(user_timezone)

    start_local = func.date_trunc(
        period, type_coerce(start, TIMESTAMP).op("AT TIME ZONE")(user_timezone)
    )

    end_local = func.date_trunc(
        period, type_coerce(end, TIMESTAMP).op("AT TIME ZONE")(user_timezone)
    )

    transaction_period_local = func.date_trunc(period, transaction_date_local)

    empty_periods_cte = select(
        func.generate_series(
            start_local,
            end_local,
            interval_dict[period],
        ).label("period")
    ).subquery("empty_periods_cte")

    periods_cte = (
        select(
            transaction_period_local.label("date"),
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expense"),
        )
        .where(between(Transaction.date, start, end))
        .group_by(transaction_period_local)
        .subquery("periods_cte")
    )

    stmt = (
        select(
            empty_periods_cte.c.period.label("label"),
            func.coalesce(periods_cte.c.income, 0).label("income"),
            func.coalesce(periods_cte.c.expense, 0).label("expense"),
        )
        .join(
            periods_cte,
            isouter=True,
            onclause=empty_periods_cte.c.period == periods_cte.c.date,
        )
        .order_by(empty_periods_cte.c.period)
    )

    result = session.exec(stmt).all()

    return result


def get_spending_by_category(session: SessionDep, start: datetime, end: datetime):
    stmt = (
        select(
            type_coerce(Category.name, VARCHAR).label("category"),
            func.sum(Transaction.amount).label("amount"),
        )
        .join(Transaction)
        .where(
            Transaction.transaction_type == TransactionType.EXPENSE,
            between(Transaction.date, start, end),
        )
        .group_by(Category.name)
    )

    result = session.exec(stmt).all()

    return result


def get_change(prev: Decimal, curr: Decimal):
    if prev == 0:
        return None

    return round((curr - prev) / prev * 100, 1)


def get_monthly_totals(
    session: SessionDep,
    user_timezone: str,
    now: datetime | None = None,
):
    if now is None:
        now = datetime.now(ZoneInfo("UTC"))

    now_expr = type_coerce(now, TIMESTAMP)
    now_local = now_expr.op("AT TIME ZONE")(user_timezone)

    start_utc = func.date_trunc("month", now_expr) - text("INTERVAL '1 month'")
    end_utc = func.date_trunc("month", now_expr) + text("INTERVAL '1 month'")

    start_local = func.date_trunc("month", now_local) - text("INTERVAL '1 month'")

    income_case = case(
        (Transaction.transaction_type == TransactionType.INCOME, Transaction.amount),
        else_=0,
    )

    expense_case = case(
        (Transaction.transaction_type == TransactionType.EXPENSE, Transaction.amount),
        else_=0,
    )

    transaction_date_local = type_coerce(Transaction.date, TIMESTAMP).op(
        "AT TIME ZONE"
    )(user_timezone)

    empty_months_cte = select(
        func.generate_series(
            start_local,
            func.date_trunc("month", now_local),
            "1 month",
        ).label("month")
    ).subquery("empty_months")

    months_cte = (
        select(
            func.date_trunc(
                "month",
                transaction_date_local,
            ).label("month"),
            func.sum(income_case).label("income"),
            func.sum(expense_case).label("expense"),
        )
        .where(
            Transaction.date >= start_utc,
            Transaction.date < end_utc,
        )
        .group_by(
            func.date_trunc(
                "month",
                transaction_date_local,
            )
        )
        .subquery("months")
    )

    stmt = (
        select(
            empty_months_cte.c.month,
            func.coalesce(months_cte.c.income, 0).label("income"),
            func.coalesce(months_cte.c.expense, 0).label("expense"),
        )
        .join(
            months_cte,
            isouter=True,
            onclause=empty_months_cte.c.month == months_cte.c.month,
        )
        .order_by(empty_months_cte.c.month)
    )

    rows = session.exec(stmt).all()

    if len(rows) != 2:
        raise ValueError("Expected previous and current month")

    return [
        MonthlyTotals(
            month=row[0],
            income=row[1],
            expense=row[2],
        )
        for row in rows
    ]


def get_financial_summary(
    session: SessionDep,
    user_timezone: str,
    now: datetime | None = None,
):
    previous, current = get_monthly_totals(session, user_timezone, now)

    prev_income = previous.income
    prev_expense = previous.expense

    curr_income = current.income
    curr_expense = current.expense

    prev_cash_flow = calculate_cash_flow(
        prev_income,
        prev_expense,
    )

    curr_cash_flow = calculate_cash_flow(
        curr_income,
        curr_expense,
    )

    prev_savings = calculate_savings_rate(
        prev_income,
        prev_expense,
    )

    curr_savings = calculate_savings_rate(
        curr_income,
        curr_expense,
    )

    return FinancialSummary(
        income=to_change(
            prev_income,
            curr_income,
        ),
        expense=to_change(
            prev_expense,
            curr_expense,
        ),
        cash_flow=to_change(
            prev_cash_flow,
            curr_cash_flow,
        ),
        savings_rate=to_change(
            prev_savings,
            curr_savings,
        ),
    )
