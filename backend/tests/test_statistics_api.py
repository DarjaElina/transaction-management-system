from datetime import datetime, UTC, timedelta
from decimal import Decimal
import uuid
from zoneinfo import ZoneInfo

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

    assert len(data) == 4

    for day in data:
        assert Decimal(day["income"]) == Decimal("0")
        assert Decimal(day["expense"]) == Decimal("0")


def test_income_expense_overview_puts_transaction_into_users_local_day(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 7, 21, 0, tzinfo=UTC),
        description="Midnight Helsinki purchase",
        amount=Decimal("12.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-07T00:00:00Z",
            "end": "2026-07-08T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["expense"]) == Decimal("12.00")


def test_income_expense_overview_respects_negative_timezone_offset(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 8, 4, 30, tzinfo=UTC),
        description="Midnight New York purchase",
        amount=Decimal("20.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-07T00:00:00Z",
            "end": "2026-07-09T00:00:00Z",
            "period": "day",
            "user_timezone": "America/New_York",
        },
    )

    data = response.json()

    july_8 = next(item for item in data if item["label"].startswith("2026-07-08"))

    assert Decimal(july_8["expense"]) == Decimal("20.00")


def test_income_expense_filter_uses_utc_range_but_groups_by_local_time(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2025, 12, 31, 23, 30, tzinfo=UTC),
        description="New year Helsinki purchase",
        amount=Decimal("30.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2025-12-31T00:00:00Z",
            "end": "2026-01-02T00:00:00Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    data = response.json()

    jan_1 = next(item for item in data if item["label"].startswith("2026-01-01"))

    assert Decimal(jan_1["expense"]) == Decimal("30.00")


def test_income_expense_overview_excludes_transaction_outside_utc_range(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 7, 10, 0, 30, tzinfo=UTC),
        description="Outside range",
        amount=Decimal("50.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/income-expense",
        params={
            "start": "2026-07-01T00:00:00Z",
            "end": "2026-07-09T23:59:59Z",
            "period": "day",
            "user_timezone": "Europe/Helsinki",
        },
    )

    data = response.json()

    assert all(Decimal(item["expense"]) == 0 for item in data)


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


def test_monthly_overview_returns_income_and_expense(
    client: TestClient,
    session,
    category: Category,
):
    now = datetime.now(ZoneInfo("UTC"))

    transaction = Transaction(
        id=uuid.uuid4(),
        date=now - timedelta(days=5),
        description="Salary",
        amount=Decimal("3000.00"),
        transaction_type=TransactionType.INCOME,
        category_id=category.id,
    )

    expense = Transaction(
        id=uuid.uuid4(),
        date=now - timedelta(days=3),
        description="Coffee",
        amount=Decimal("5.00"),
        transaction_type=TransactionType.EXPENSE,
        category_id=category.id,
    )

    session.add_all([transaction, expense])
    session.commit()

    response = client.get(
        "/api/statistics/monthly-overview",
        params={
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["income"]["current"] == "3000.00"
    assert data["expense"]["current"] == "5.00"


def test_monthly_overview_returns_previous_month_values(
    client: TestClient,
    session,
    category: Category,
):
    transaction = Transaction(
        id=uuid.uuid4(),
        date=datetime(2026, 6, 15, tzinfo=UTC),
        description="Old salary",
        amount=Decimal("2000.00"),
        transaction_type=TransactionType.INCOME,
        category_id=category.id,
    )

    session.add(transaction)
    session.commit()

    response = client.get(
        "/api/statistics/monthly-overview",
        params={
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["income"]["previous"] == "2000.00"


def test_monthly_overview_returns_zero_when_no_transactions(
    client: TestClient,
):
    response = client.get(
        "/api/statistics/monthly-overview",
        params={
            "user_timezone": "Europe/Helsinki",
        },
    )

    assert response.status_code == 200

    data = response.json()

    assert data["income"]["current"] == "0"
    assert data["expense"]["current"] == "0"
