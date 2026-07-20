from datetime import datetime
from decimal import Decimal
import uuid
from zoneinfo import ZoneInfo

import pytest

from app.models.transaction import Transaction
from app.services.statistics_service import get_monthly_overview
from app.models.category import Category
from app.core.enums import TransactionType


@pytest.fixture
def category(session):
    category = Category(
        id=uuid.uuid4(),
        name="Software Licenses",
        description="Test category",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def test_monthly_overview_returns_previous_and_current_month(
    session,
    category: Category,
):
    session.add_all(
        [
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 6, 15, tzinfo=ZoneInfo("UTC")),
                description="June salary",
                amount=Decimal("1000"),
                transaction_type=TransactionType.INCOME,
                category_id=category.id,
            ),
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 10, tzinfo=ZoneInfo("UTC")),
                description="July coffee",
                amount=Decimal("100"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
        ]
    )

    session.commit()

    result = get_monthly_overview(
        session=session,
        user_timezone="Europe/Helsinki",
        now=datetime(2026, 7, 20, 10, tzinfo=ZoneInfo("UTC")),
    )

    assert result.income.previous == Decimal("1000")
    assert result.expense.current == Decimal("100")


def test_monthly_overview_uses_user_timezone_for_month_boundary(
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2025, 12, 31, 23, 30, tzinfo=ZoneInfo("UTC")),
        description="New year Helsinki transaction",
        amount=Decimal("50"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    result = get_monthly_overview(
        session=session,
        user_timezone="Europe/Helsinki",
        now=datetime(2026, 1, 1, 0, 30, tzinfo=ZoneInfo("UTC")),
    )

    assert result.expense.current == Decimal("50")


def test_monthly_overview_handles_negative_timezone_offset(
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 1, 1, 1, 0, tzinfo=ZoneInfo("UTC")),
        description="NY transaction",
        amount=Decimal("70"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    result = get_monthly_overview(
        session=session,
        user_timezone="America/New_York",
        now=datetime(2026, 1, 1, 5, 0, tzinfo=ZoneInfo("UTC")),
    )

    assert result.expense.previous == Decimal("70")
