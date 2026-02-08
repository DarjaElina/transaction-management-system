from sqlmodel import Session
from fastapi.testclient import TestClient

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