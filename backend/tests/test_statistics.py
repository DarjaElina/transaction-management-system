from datetime import datetime, UTC
from decimal import Decimal
import uuid

from fastapi.testclient import TestClient
import pytest

from app.models.transaction import Transaction
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


def test_income_expense_overview_respects_user_timezone(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 7, 21, 0, tzinfo=UTC),
        description="Coffee in Helsinki",
        amount=Decimal("10.50"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-10T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["expense"]) == Decimal("10.50")
    assert Decimal(july_8["income"]) == Decimal("0")


def test_income_expense_overview_respects_new_york_timezone(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 7, 21, 0, tzinfo=UTC),
        description="Coffee in New York",
        amount=Decimal("15.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-10T23:59:59Z",
            "period": "day",
            "user_timezone": "America/New_York",
        },
    )

    assert response.status_code == 200

    data = response.json()

    july_7 = next(item for item in data if item["label"].startswith("2026-07-07"))

    assert Decimal(july_7["expense"]) == Decimal("15.00")


def test_income_expense_overview_respects_tokyo_timezone(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 7, 21, 0, tzinfo=UTC),
        description="Dinner in Tokyo",
        amount=Decimal("20.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-10T23:59:59Z",
            "period": "day",
            "user_timezone": "Asia/Tokyo",
        },
    )

    assert response.status_code == 200

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["expense"]) == Decimal("20.00")


def test_income_expense_overview_groups_transactions_by_day(
    client: TestClient,
    session,
    category: Category,
):
    transactions = [
        Transaction(
            id=uuid.uuid4(),
            date=datetime(2026, 7, 7, 21, 0, tzinfo=UTC),
            description="Coffee",
            amount=Decimal("10.00"),
            transaction_type=TransactionType.EXPENSE,
            category_id=category.id,
        ),
        Transaction(
            id=uuid.uuid4(),
            date=datetime(2026, 7, 7, 22, 0, tzinfo=UTC),
            description="Lunch",
            amount=Decimal("25.00"),
            transaction_type=TransactionType.EXPENSE,
            category_id=category.id,
        ),
    ]

    session.add_all(transactions)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-10T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["expense"]) == Decimal("35.00")


def test_income_expense_overview_returns_income_and_expense(
    client: TestClient,
    session,
    category: Category,
):
    session.add_all(
        [
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 7, 21, tzinfo=UTC),
                description="Salary",
                amount=Decimal("1000.00"),
                transaction_type=TransactionType.INCOME,
                category_id=category.id,
            ),
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 7, 22, tzinfo=UTC),
                description="Coffee",
                amount=Decimal("5.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
        ]
    )

    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-10T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["income"]) == Decimal("1000.00")
    assert Decimal(july_8["expense"]) == Decimal("5.00")


def test_income_expense_overview_returns_empty_periods(
    client: TestClient,
):
    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-03T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 3

    for day in data:
        assert Decimal(day["income"]) == Decimal("0")
        assert Decimal(day["expense"]) == Decimal("0")


def test_spending_by_category_returns_category_totals(
    client: TestClient,
    session,
    category: Category,
):
    session.add_all(
        [
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 5, tzinfo=UTC),
                description="VS Code Theme",
                amount=Decimal("10.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 6, tzinfo=UTC),
                description="JetBrains",
                amount=Decimal("20.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
        ]
    )

    session.commit()

    response = client.get(
        "/api/statistics/spending-by-category",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-31T23:59:59Z",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert len(data) == 1
    assert data[0]["category"] == "Software Licenses"
    assert Decimal(data[0]["amount"]) == Decimal("30.00")


def test_spending_by_category_ignores_income_transactions(
    client: TestClient,
    session,
    category: Category,
):
    session.add_all(
        [
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 5, tzinfo=UTC),
                description="Coffee",
                amount=Decimal("10.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 5, tzinfo=UTC),
                description="Salary",
                amount=Decimal("1000.00"),
                transaction_type=TransactionType.INCOME,
                category_id=category.id,
            ),
        ]
    )

    session.commit()

    response = client.get(
        "/api/statistics/spending-by-category",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-31T23:59:59Z",
        },
    )

    data = response.json()

    assert len(data) == 1
    assert Decimal(data[0]["amount"]) == Decimal("10.00")


def test_spending_by_category_ignores_transactions_outside_period(
    client: TestClient,
    session,
    category: Category,
):
    session.add_all(
        [
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 6, 30, tzinfo=UTC),
                description="Old expense",
                amount=Decimal("100.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
            Transaction(
                id=uuid.uuid4(),
                date=datetime(2026, 7, 5, tzinfo=UTC),
                description="Current expense",
                amount=Decimal("20.00"),
                transaction_type=TransactionType.EXPENSE,
                category_id=category.id,
            ),
        ]
    )

    session.commit()

    response = client.get(
        "/api/statistics/spending-by-category",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-31T23:59:59Z",
        },
    )

    data = response.json()

    assert len(data) == 1
    assert Decimal(data[0]["amount"]) == Decimal("20.00")


def test_spending_by_category_returns_empty_list_when_no_expenses(
    client: TestClient,
):
    response = client.get(
        "/api/statistics/spending-by-category",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-31T23:59:59Z",
        },
    )

    assert response.status_code == 200
    assert response.json() == []
