from fastapi.testclient import TestClient
from sqlmodel import Session
from app.core.enums import TransactionType


def test_create_category(client: TestClient):
    response = client.post(
        "/categories/",
        json={
            "name": "Software Licenses",
            "description": "Software Licenses expenses",
            "allowed_type": "expense",
            "is_active": True,
        },
    )
    data = response.json()

    assert response.status_code == 200
    assert data["name"] == "Software Licenses"
    assert data["description"] == "Software Licenses expenses"
    assert data["allowed_type"] == "expense"
    assert data["is_active"] is True


def test_create_category_missing_name(client: TestClient):
    response = client.post(
        "/categories/",
        json={
            "allowed_type": "expense",
            "is_active": True,
        },
    )

    assert response.status_code == 422


def test_category_allowed_type_invalid(client: TestClient):
    response = client.post(
        "/categories/",
        json={
            "name": "Invalid",
            "allowed_type": "banana 🍌",
            "is_active": True,
        },
    )

    assert response.status_code == 422


def test_read_categories(session: Session, client: TestClient):
    from app.models.category import Category

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

    response = client.get("/categories/")
    data = response.json()

    assert response.status_code == 200
    assert len(data) == 2


def test_update_category(session: Session, client: TestClient):
    from app.models.category import Category

    category = Category(
        name="Old name",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )

    session.add(category)
    session.commit()

    response = client.patch(
        f"/categories/{category.id}",
        json={"name": "New name"},
    )

    data = response.json()

    assert response.status_code == 200
    assert data["name"] == "New name"


def test_delete_category(session: Session, client: TestClient):
    from app.models.category import Category

    category = Category(
        name="To delete",
        allowed_type=TransactionType.EXPENSE,
        is_active=True,
    )

    session.add(category)
    session.commit()

    response = client.delete(f"/categories/{category.id}")

    category_in_db = session.get(Category, category.id)

    assert response.status_code == 200
    assert category_in_db is None


def test_unknown_attribute_forbidden(client: TestClient):
    response = client.post(
        "/categories/",
        json={
            "name": "Software Licenses",
            "description": "Software Licenses expenses",
            "allowed_type": "expense",
            "is_active": True,
            "should_not_be_here": "hello 👹",
        },
    )
    assert response.status_code == 422
