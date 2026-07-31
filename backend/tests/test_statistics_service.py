from datetime import UTC, datetime
from decimal import Decimal
import uuid

import pytest
from sqlmodel import Session

from app.models.transaction import Transaction
from app.services.statistics import get_financial_summary, get_monthly_totals
from app.models.category import Category
from app.models.user import User
from app.core.enums import TransactionType


@pytest.fixture
def category(session: Session, user: User):
    category = Category(
        id=uuid.uuid4(),
        name="Software Licenses",
        description="Test category",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
        user_id=user.id,
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def create_transaction(
    session: Session,
    category: Category,
    amount: str,
    transaction_type: TransactionType,
    date: datetime,
    user: User,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=date,
        description="Test transaction",
        amount=Decimal(amount),
        transaction_type=transaction_type,
        category_id=category.id,
        user_id=user.id,
    )

    session.add(transaction)
    session.commit()

    return transaction


def test_get_monthly_totals_returns_previous_and_current_month(
    session: Session, category: Category, user: User
):
    create_transaction(
        session,
        category,
        "1000",
        TransactionType.INCOME,
        datetime(2026, 6, 15, tzinfo=UTC),
        user,
    )

    create_transaction(
        session,
        category,
        "200",
        TransactionType.EXPENSE,
        datetime(2026, 7, 10, tzinfo=UTC),
        user,
    )

    result = get_monthly_totals(
        session,
        user,
        "Europe/Helsinki",
        datetime(2026, 7, 20, tzinfo=UTC),
    )

    previous, current = result

    assert previous.income == Decimal("1000")
    assert previous.expense == Decimal("0")

    assert current.income == Decimal("0")
    assert current.expense == Decimal("200")


def test_get_monthly_totals_returns_zero_for_empty_month(session: Session, user: User):
    result = get_monthly_totals(
        session,
        user,
        "Europe/Helsinki",
        datetime(2026, 7, 20, tzinfo=UTC),
    )

    previous, current = result

    assert previous.income == 0
    assert previous.expense == 0

    assert current.income == 0
    assert current.expense == 0


def test_get_monthly_totals_respects_timezone(
    session: Session, category: Category, user: User
):
    create_transaction(
        session,
        category,
        "50",
        TransactionType.EXPENSE,
        datetime(2025, 12, 31, 23, 30, tzinfo=UTC),
        user,
    )

    result = get_monthly_totals(
        session,
        user,
        "Europe/Helsinki",
        datetime(2026, 1, 1, 0, 30, tzinfo=UTC),
    )

    _, current = result

    assert current.expense == Decimal("50")


def test_financial_summary_calculates_cash_flow_and_savings(
    session: Session, category: Category, user: User
):
    create_transaction(
        session,
        category,
        "3000",
        TransactionType.INCOME,
        datetime(2026, 6, 15, tzinfo=UTC),
        user,
    )

    create_transaction(
        session,
        category,
        "1000",
        TransactionType.EXPENSE,
        datetime(2026, 6, 20, tzinfo=UTC),
        user,
    )

    create_transaction(
        session,
        category,
        "4000",
        TransactionType.INCOME,
        datetime(2026, 7, 10, tzinfo=UTC),
        user,
    )

    create_transaction(
        session,
        category,
        "1500",
        TransactionType.EXPENSE,
        datetime(2026, 7, 11, tzinfo=UTC),
        user,
    )

    result = get_financial_summary(
        session,
        user,
        "Europe/Helsinki",
        datetime(2026, 7, 20, tzinfo=UTC),
    )

    assert result.income.current == Decimal("4000")
    assert result.expense.current == Decimal("1500")

    assert result.cash_flow.current == Decimal("2500")
