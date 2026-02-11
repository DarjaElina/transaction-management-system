from sqlmodel import Session
from fastapi.testclient import TestClient
from datetime import datetime
from decimal import Decimal

from app.models.transaction import Transaction
from app.models.enums import TransactionType


def test_create_transaction(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803Z",
            "description": "Test description",
            "category": "Test category",
            "amount": 99.99,
            "transaction_type": "income"
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert data["date"] == "2026-02-07T18:57:38.803000"
    assert data["description"] == "Test description"
    assert data["category"] == "Test category"
    assert Decimal(data["amount"]) == Decimal("99.99")


def test_create_transaction_incomplete(client: TestClient):
    response = client.post("/transactions/", json={"category": "Food"})
    assert response.status_code == 422


def test_create_transaction_date_invalid(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "Invalid date",
            "description": "Test description",
            "category": "Test category",
            "amount": 99.99,
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422


def test_amount_cannot_be_any_string(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": "Not a decimal :(",
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422


def test_amount_can_be_decimal_string(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": "99.99",
            "transaction_type": "income"
        },
    )
    assert response.status_code == 200


def test_amount_max_decimal_places_is_2(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 99.9999,
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422


def test_amount_is_converted_to_decimal(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 99,
            "transaction_type": "income"
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("99.00")


def test_amount_is_rounded_to_two_decimals(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 10.1,
            "transaction_type": "income"
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert Decimal(data["amount"]) == Decimal("10.10")


def test_amount_max_digits_cannot_exceed_19(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 9999999999999999999.99,
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422

def test_amount_cannot_be_negative(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": -15.99,
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422

def test_amount_cannot_be_zero(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 0,
            "transaction_type": "income"
        },
    )
    assert response.status_code == 422


def test_read_transactions(session: Session, client: TestClient):
    transaction_1 = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category="Food",
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME
    )
    transaction_2 = Transaction(
        date=datetime(2025, 5, 18),
        description="Test transaction for 10.50€",
        category="Sport",
        amount=Decimal("10.50"),
        transaction_type=TransactionType.INCOME
    )

    session.add(transaction_1)
    session.add(transaction_2)
    session.commit()

    response = client.get("/transactions/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 2
    assert data[0]["description"] == transaction_1.description
    assert data[0]["category"] == transaction_1.category
    assert Decimal(data[0]["amount"]) == Decimal(str(transaction_1.amount))
    assert data[1]["description"] == transaction_2.description
    assert data[1]["category"] == transaction_2.category
    assert Decimal(data[1]["amount"]) == Decimal(str(transaction_2.amount))


def test_read_transaction(session: Session, client: TestClient):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category="Food",
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME
    )

    session.add(transaction)
    session.commit()

    response = client.get(f"/transactions/{transaction.id}")
    data = response.json()

    assert response.status_code == 200
    assert data["description"] == transaction.description
    assert data["category"] == transaction.category
    assert Decimal(data["amount"]) == Decimal(str(transaction.amount))


def test_update_transaction(session: Session, client: TestClient):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category="Food",
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME
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


def test_delete_transaction(session: Session, client: TestClient):
    transaction = Transaction(
        date=datetime(2025, 5, 17),
        description="Test transaction for 99.99€",
        category="Food",
        amount=Decimal("99.99"),
        transaction_type=TransactionType.INCOME
    )
    session.add(transaction)
    session.commit()

    response = client.delete(f"/transactions/{transaction.id}")

    transaction_in_db = session.get(Transaction, transaction.id)

    assert response.status_code == 200

    assert transaction_in_db is None

def test_transaction_type_should_be_income_expense_or_transfer(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 1000.00,
            "transaction_type": "bought a pony 🦄"
        },
    )
    assert response.status_code == 422

def test_transaction_type_cannot_be_null(client: TestClient):
    response = client.post(
        "/transactions/",
        json={
            "date": "2026-02-07T18:57:38.803000",
            "description": "Test description",
            "category": "Test category",
            "amount": 1000.00
        },
    )
    assert response.status_code == 422
