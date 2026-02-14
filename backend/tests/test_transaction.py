import pytest
from sqlmodel import Session
from fastapi.testclient import TestClient
from datetime import datetime
from decimal import Decimal

from app.models.transaction import Transaction
from app.models.category import Category
from app.core.enums import TransactionType

import pytz


@pytest.fixture
def category(session):
    category = Category(
        id=1,
        name="Software Licenses",
        description="Test category",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )
    session.add(category)
    session.commit()
    session.refresh(category)
    return category


def test_create_transaction(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 99.99,
            "transaction_type": "expense",
        },
    )
    data = response.json()

    assert response.status_code == 200

    expected = datetime.fromisoformat("2026-02-14T13:49:11.942+00:00")
    returned = datetime.fromisoformat(data["date"].replace("Z", "+00:00"))
    assert returned == expected

    assert data["description"] == "Test description"
    assert data["category_id"] == category.id
    assert Decimal(data["amount"]) == Decimal("99.99")


def test_create_transaction_incomplete(client: TestClient, category):
    response = client.post("/transactions/", json={"category_id": category.id})
    assert response.status_code == 422


def test_create_transaction_date_invalid(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "Invalid date",
            "description": "Test description",
            "category_id": category.id,
            "amount": 99.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_any_string(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": "Not a decimal :(",
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_can_be_decimal_string(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": "99.99",
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 200


def test_amount_max_decimal_places_is_2(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 99.9999,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_is_converted_to_decimal(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 99,
            "transaction_type": "expense",
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("99.00")


def test_amount_is_rounded_to_two_decimals(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 10.1,
            "transaction_type": "expense",
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("10.10")


def test_amount_max_digits_cannot_exceed_19(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 9999999999999999999.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_negative(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": -15.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_zero(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 0,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_read_transactions(session: Session, client: TestClient, category):
    transaction_1 = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category=category,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.EXPENSE,
    )
    transaction_2 = Transaction(
        date=datetime(2025, 5, 18),
        description="Test transaction for 10.50€",
        category=category,
        amount=Decimal("10.50"),
        transaction_type=TransactionType.EXPENSE,
    )

    session.add(transaction_1)
    session.add(transaction_2)
    session.commit()

    response = client.get("/transactions/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]["description"] == transaction_2.description
    assert data[0]["category_id"] == transaction_2.category.id
    assert Decimal(data[0]["amount"]) == Decimal(str(transaction_2.amount))
    assert data[1]["description"] == transaction_1.description
    assert data[1]["category_id"] == transaction_1.category.id
    assert Decimal(data[1]["amount"]) == Decimal(str(transaction_1.amount))


def test_read_transaction(session: Session, client: TestClient, category):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category_id=category.id,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME,
    )

    session.add(transaction)
    session.commit()

    response = client.get(f"/transactions/{transaction.id}")
    data = response.json()

    assert response.status_code == 200
    assert data["description"] == transaction.description
    assert data["category_id"] == transaction.category.id
    assert Decimal(data["amount"]) == Decimal(str(transaction.amount))


def test_update_transaction(session: Session, client: TestClient, category):
    tz = pytz.timezone("Asia/Singapore")
    transaction = Transaction(
        date=datetime(2023, 5, 4, 10, 30, 0, tzinfo=tz),
        description="Test transaction for 99.99€",
        category_id=category.id,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME,
    )
    session.add(transaction)
    session.commit()

    response = client.patch(
        f"/transactions/{transaction.id}", json={"description": "Updated description"}
    )
    data = response.json()

    assert response.status_code == 200
    assert data["id"] == transaction.id
    assert data["description"] == "Updated description"


def test_delete_transaction(session: Session, client: TestClient, category):
    tz = pytz.timezone("Asia/Singapore")
    transaction = Transaction(
        date=datetime(2023, 5, 4, 10, 30, 0, tzinfo=tz),
        description="Test transaction for 99.99€",
        category_id=category.id,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME,
    )
    session.add(transaction)
    session.commit()

    response = client.delete(f"/transactions/{transaction.id}")

    transaction_in_db = session.get(Transaction, transaction.id)

    assert response.status_code == 200

    assert transaction_in_db is None


def test_transaction_type_should_be_income_or_expense(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 1000.00,
            "transaction_type": "bought a pony 🦄",
        },
    )
    assert response.status_code == 422


def test_transaction_type_cannot_be_null(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 1000.00,
        },
    )
    assert response.status_code == 422


def test_unknown_attribute_forbidden(client: TestClient, category):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": category.id,
            "amount": 1000.00,
            "should_not_be_here": "hello 👹",
        },
    )
    assert response.status_code == 422
