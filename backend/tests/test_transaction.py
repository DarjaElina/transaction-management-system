import pytest
from sqlmodel import Session
from fastapi.testclient import TestClient
from datetime import datetime, UTC, timedelta
from decimal import Decimal

from app.models.transaction import Transaction
from app.models.category import Category
from app.core.enums import TransactionType

import uuid


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


def test_create_transaction(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
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
    assert data["category_id"] == str(category.id)
    assert Decimal(data["amount"]) == Decimal("99.99")


def test_create_transaction_incomplete(client: TestClient, category):
    response = client.post("/api/transactions/", json={"category_id": str(category.id)})
    assert response.status_code == 422


def test_create_transaction_date_invalid(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "Invalid date",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 99.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_any_string(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": "Not a decimal :(",
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_can_be_decimal_string(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": "99.99",
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 200


def test_amount_max_decimal_places_is_2(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 99.9999,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_is_converted_to_decimal(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 99,
            "transaction_type": "expense",
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("99.00")


def test_amount_is_rounded_to_two_decimals(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 10.1,
            "transaction_type": "expense",
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("10.10")


def test_amount_max_digits_cannot_exceed_19(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 9999999999999999999.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_negative(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": -15.99,
            "transaction_type": "expense",
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_zero(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
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

    response = client.get("/api/transactions/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]["description"] == transaction_2.description
    assert data[0]["category_id"] == str(transaction_2.category.id)
    assert Decimal(data[0]["amount"]) == Decimal(str(transaction_2.amount))
    assert data[1]["description"] == transaction_1.description
    assert data[1]["category_id"] == str(transaction_1.category.id)
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

    response = client.get(f"/api/transactions/{transaction.id}")
    data = response.json()

    assert response.status_code == 200
    assert data["description"] == transaction.description
    assert data["category_id"] == str(transaction.category.id)
    assert Decimal(data["amount"]) == Decimal(str(transaction.amount))


def test_update_transaction(session: Session, client: TestClient, category):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category_id=category.id,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME,
    )
    session.add(transaction)
    session.commit()

    response = client.patch(
        f"/api/transactions/{transaction.id}",
        json={"description": "Updated description"},
    )
    data = response.json()

    assert response.status_code == 200
    assert data["id"] == str(transaction.id)
    assert data["description"] == "Updated description"


def test_delete_transaction(session: Session, client: TestClient, category):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category_id=category.id,
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME,
    )
    session.add(transaction)
    session.commit()

    response = client.delete(f"/api/transactions/{transaction.id}")

    transaction_in_db = session.get(Transaction, transaction.id)

    assert response.status_code == 200

    assert transaction_in_db is None


def test_transaction_type_should_be_income_or_expense(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 1000.00,
            "transaction_type": "bought a pony 🦄",
        },
    )
    assert response.status_code == 422


def test_transaction_type_cannot_be_null(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 1000.00,
        },
    )
    assert response.status_code == 422


def test_unknown_attribute_forbidden(client: TestClient, category):
    response = client.post(
        "/api/transactions/",
        json={
            "date": "2026-02-14T13:49:11.942Z",
            "description": "Test description",
            "category_id": str(category.id),
            "amount": 1000.00,
            "should_not_be_here": "hello 👹",
        },
    )
    assert response.status_code == 422


def test_read_transaction_not_found(client: TestClient):
    fake_id = uuid.uuid4()
    response = client.get(f"/api/transactions/{fake_id}")

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"]
        == f"Transaction with ID {fake_id} not found"
    )


def test_delete_transaction_not_found(client: TestClient):
    fake_id = uuid.uuid4()
    response = client.delete(f"/api/transactions/{fake_id}")

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"]
        == f"Transaction with ID {fake_id} not found"
    )


def test_update_transaction_not_found(client: TestClient):
    fake_id = uuid.uuid4()
    response = client.patch(
        f"/api/transactions/{fake_id}",
        json={"description": "Nope"},
    )

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"]
        == f"Transaction with ID {fake_id} not found"
    )


def test_create_transaction_future_date_forbidden(client: TestClient, category):
    future_date = (datetime.now(UTC) + timedelta(days=1)).isoformat()

    response = client.post(
        "/api/transactions/",
        json={
            "date": future_date,
            "description": "Future transaction",
            "category_id": str(category.id),
            "amount": 10.00,
            "transaction_type": "expense",
        },
    )

    assert response.status_code == 422
    assert (
        response.json()["error"]["message"]
        == "Validation error on field 'date': Transaction date must be in the past"
    )


def test_update_transaction_future_date_forbidden(
    session: Session, client: TestClient, category
):
    transaction = Transaction(
        date=datetime(2023, 1, 1),
        description="Old",
        category_id=category.id,
        amount=Decimal("10.00"),
        transaction_type=TransactionType.EXPENSE,
    )
    session.add(transaction)
    session.commit()

    future_date = (datetime.now(UTC) + timedelta(days=1)).isoformat()

    response = client.patch(
        f"/api/transactions/{transaction.id}",
        json={"date": future_date},
    )

    assert response.status_code == 422
    assert (
        response.json()["error"]["message"]
        == "Validation error on field 'date': Transaction date must be in the past"
    )


def test_create_transaction_category_type_mismatch(
    client: TestClient, session: Session
):
    category = Category(
        name="ExpenseOnly",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )
    session.add(category)
    session.commit()

    response = client.post(
        "/api/transactions/",
        json={
            "date": "2025-01-01T10:00:00Z",
            "description": "Invalid",
            "category_id": str(category.id),
            "amount": 50.00,
            "transaction_type": "income",
        },
    )

    assert response.status_code == 422
    assert (
        response.json()["error"]["message"]
        == "Validation error on field 'transaction_type': Transaction of this type is not allowed for category ExpenseOnly"
    )


def test_filter_transactions_by_category(
    session: Session, client: TestClient, category
):
    other_category = Category(
        name="Other",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
        id=uuid.uuid4(),
    )
    session.add(other_category)
    session.commit()

    session.add(
        Transaction(
            date=datetime(2025, 1, 1),
            description="Cat1",
            category_id=category.id,
            amount=Decimal("10.00"),
            transaction_type=TransactionType.EXPENSE,
        )
    )

    session.add(
        Transaction(
            date=datetime(2025, 1, 1),
            description="Cat2",
            category_id=other_category.id,
            amount=Decimal("20.00"),
            transaction_type=TransactionType.EXPENSE,
        )
    )

    session.commit()

    response = client.get(f"/api/transactions/?category_id={category.id}")

    data = response.json()

    assert len(data) == 1
    assert data[0]["description"] == "Cat1"
