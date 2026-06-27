from fastapi.testclient import TestClient
from sqlmodel import Session
from datetime import datetime
from decimal import Decimal

from app.core.enums import TransactionType
from app.models.transaction import Transaction
from app.models.category import Category

import uuid


def test_create_category(client: TestClient):
    response = client.post(
        "/api/categories/",
        json={
            "name": "Software Licenses",
            "description": "Software Licenses expenses",
            "allowed_type": "expense",
            "is_active": True,
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert data["name"] == "software licenses"
    assert data["description"] == "Software Licenses expenses"
    assert data["allowed_type"] == "expense"
    assert data["is_active"] is True


def test_create_category_missing_name(client: TestClient):
    response = client.post(
        "/api/categories/",
        json={
            "allowed_type": "expense",
            "is_active": True,
        },
    )

    assert response.status_code == 422


def test_category_allowed_type_invalid(client: TestClient):
    response = client.post(
        "/api/categories/",
        json={
            "name": "Invalid",
            "allowed_type": "banana 🍌",
            "is_active": True,
        },
    )

    assert response.status_code == 422


def test_read_categories(session: Session, client: TestClient):
    category_1 = Category(
        name="Food",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )

    category_2 = Category(
        name="Salary",
        allowed_type=TransactionType.INCOME,
        is_active=True,
    )

    session.add(category_1)
    session.add(category_2)
    session.commit()

    response = client.get("/api/categories/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 2


def test_update_category(session: Session, client: TestClient):
    category = Category(
        name="Old name",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )

    session.add(category)
    session.commit()

    response = client.patch(
        f"/api/categories/{category.id}",
        json={"name": "New name"},
    )

    data = response.json()

    assert response.status_code == 200
    assert data["name"] == "new name"


def test_delete_category(session: Session, client: TestClient):
    category = Category(
        name="To delete",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )

    session.add(category)
    session.commit()

    response = client.delete(f"/api/categories/{category.id}")

    category_in_db = session.get(Category, category.id)

    assert response.status_code == 200
    assert category_in_db is None


def test_unknown_attribute_forbidden(client: TestClient):
    response = client.post(
        "/api/categories/",
        json={
            "name": "Software Licenses",
            "description": "Software Licenses expenses",
            "allowed_type": "expense",
            "is_active": True,
            "should_not_be_here": "hello 👹",
        },
    )
    assert response.status_code == 422


def test_read_category_not_found(client: TestClient):
    fake_id = str(uuid.uuid4())
    response = client.get(f"/api/categories/{fake_id}")

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"] == f"Category with ID {fake_id} not found"
    )


def test_delete_category_not_found(client: TestClient):
    fake_id = str(uuid.uuid4())
    response = client.delete(f"/api/categories/{fake_id}")

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"] == f"Category with ID {fake_id} not found"
    )


def test_update_category_not_found(client: TestClient):
    fake_id = str(uuid.uuid4())
    response = client.patch(
        f"/api/categories/{fake_id}",
        json={"name": "Does not exist"},
    )

    assert response.status_code == 404
    assert (
        response.json()["error"]["message"] == f"Category with ID {fake_id} not found"
    )


def test_update_category_allowed_type_conflict(session: Session, client: TestClient):
    category = Category(
        name="Food",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )
    session.add(category)
    session.commit()

    transaction = Transaction(
        date=datetime(2025, 1, 1),
        description="Existing transaction",
        category_id=category.id,
        amount=Decimal("10.00"),
        transaction_type=TransactionType.EXPENSE,
    )
    session.add(transaction)
    session.commit()

    response = client.patch(
        f"/api/categories/{category.id}",
        json={"allowed_type": "income"},
    )

    assert response.status_code == 409
    assert (
        response.json()["error"]["message"]
        == "Cannot change allowed type because transactions exist"
    )


def test_create_category_duplicate_name(client: TestClient):
    category = {
        "name": "Food",
        "allowed_type": "expense",
        "is_active": True,
    }

    client.post("/api/categories/", json=category)
    response = client.post("/api/categories/", json=category)

    assert response.status_code == 409
    assert response.json()["error"]["message"] == "Category already exists"


def test_filter_categories_by_name(session: Session, client: TestClient):
    session.add(
        Category(name="Food", allowed_type=TransactionType.EXPENSE, is_active=True)
    )
    session.add(
        Category(name="Salary", allowed_type=TransactionType.INCOME, is_active=True)
    )
    session.commit()

    response = client.get("/api/categories/?name=foo")

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Food"


def test_filter_categories_by_is_active(session: Session, client: TestClient):
    session.add(
        Category(name="Active", allowed_type=TransactionType.EXPENSE, is_active=True)
    )
    session.add(
        Category(name="Inactive", allowed_type=TransactionType.EXPENSE, is_active=False)
    )
    session.commit()

    response = client.get("/api/categories/?is_active=true")

    data = response.json()

    assert len(data) == 1
    assert data[0]["name"] == "Active"


def test_filter_categories_by_allowed_type(session: Session, client: TestClient):
    session.add(
        Category(
            name="ExpenseCat", allowed_type=TransactionType.EXPENSE, is_active=True
        )
    )
    session.add(
        Category(name="IncomeCat", allowed_type=TransactionType.INCOME, is_active=True)
    )
    session.commit()

    response = client.get("/api/categories/?allowed_type=expense")

    data = response.json()

    assert len(data) == 1
    assert data[0]["allowed_type"] == "expense"


def test_categories_pagination(session: Session, client: TestClient):
    for i in range(5):
        session.add(
            Category(
                name=f"Cat{i}",
                allowed_type=TransactionType.EXPENSE,
                is_active=True,
            )
        )
    session.commit()

    response = client.get("/api/categories/?offset=0&limit=2")

    data = response.json()

    assert len(data) == 2
