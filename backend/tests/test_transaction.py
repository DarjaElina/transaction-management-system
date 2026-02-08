from sqlmodel import Session
from fastapi.testclient import TestClient
from datetime import datetime

from app.models.transaction import Transaction

def test_create_transaction(client: TestClient):
  response = client.post(
    "/transactions/",
    json={
      "date": "2026-02-07T18:57:38.803Z",
      "description": "Test description",
      "category": "Test category",
      "amount": 99.99
    }
  )
  data = response.json()

  assert response.status_code == 200
  assert data["date"] == "2026-02-07T18:57:38.803000"
  assert data["description"] == "Test description"
  assert data["category"] == "Test category"
  assert data["amount"] == 99.99

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
      "amount": 99.99
    }
  )
  assert response.status_code == 422

def test_create_transaction_amount_invalid(client: TestClient):
  response = client.post(
    "/transactions/",
    json={
      "date": "2026-02-07T18:57:38.803000",
      "description": "Test description",
      "category": "Test category",
      "amount": "Not a float :("
    }
  )
  assert response.status_code == 422

def test_read_transactions(session: Session, client: TestClient):
  transaction_1 = Transaction(
    date = datetime(2025, 5, 17),
    description = "Test transaction for 99.99€",
    category = "Food",
    amount = 99.99
  )
  transaction_2 = Transaction(
    date = datetime(2025, 5, 18),
    description = "Test transaction for 10.50€",
    category = "Sport",
    amount = 10.50
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
  assert data[0]["amount"] == transaction_1.amount
  assert data[1]["description"] == transaction_2.description
  assert data[1]["category"] == transaction_2.category 
  assert data[1]["amount"] == transaction_2.amount 

def test_read_transaction(session: Session, client: TestClient):
  transaction = Transaction(
    date = datetime(2025, 5, 17),
    description = "Test transaction for 99.99€",
    category = "Food",
    amount = 99.99
  )

  session.add(transaction)
  session.commit()

  response = client.get(f"/transactions/{transaction.id}")
  data = response.json()

  assert response.status_code == 200
  assert data["description"] == transaction.description
  assert data["category"] == transaction.category 
  assert data["amount"] == transaction.amount

def test_update_transaction(session: Session, client: TestClient):
  transaction = Transaction(
    date = datetime(2025, 5, 17),
    description = "Test transaction for 99.99€",
    category = "Food",
    amount = 99.99
  )
  session.add(transaction)
  session.commit()

  response = client.patch(f"/transactions/{transaction.id}", json={"description": "Updated description"})
  data = response.json()

  assert response.status_code == 200
  assert data["id"] == transaction.id
  assert data["description"] == "Updated description"

def test_delete_transaction(session: Session, client: TestClient):
  transaction = Transaction(
    date = datetime(2025, 5, 17),
    description = "Test transaction for 99.99€",
    category = "Food",
    amount = 99.99
  )
  session.add(transaction)
  session.commit()

  response = client.delete(f"/transactions/{transaction.id}")

  transaction_in_db = session.get(Transaction, transaction.id)

  assert response.status_code == 200

  assert transaction_in_db is None