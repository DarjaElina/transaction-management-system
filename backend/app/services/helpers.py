from decimal import Decimal

from app.schemas.statistics import Change


def get_change(previous: Decimal, current: Decimal):
    if previous == 0:
        return None

    return round((current - previous) / previous * 100, 1)


def to_change(previous: Decimal, current: Decimal) -> Change:
    return Change(
        current=current,
        previous=previous,
        change=get_change(previous, current),
    )


def calculate_cash_flow(
    income: Decimal,
    expense: Decimal,
):
    return income - expense


def calculate_savings_rate(
    income: Decimal,
    expense: Decimal,
):
    if income == 0:
        return Decimal("0")

    return round(
        (income - expense) / income * 100,
        1,
    )
