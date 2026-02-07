from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from ..main import app
from ..db.database import get_session

def test_create_transaction():
  engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
  )
  SQLModel.metadata.create_all(engine)

  with Session(engine) as session:

    def get_session_override():
      return session

    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)

    response = client.post(
      "/transactions/",
      json={
        "date": "2026-02-07T18:57:38.803Z",
        "description": "Test description",
        "category": "Test category",
        "amount": 99.99
      }
    )

    app.dependency_overrides.clear()
    data = response.json()

    assert response.status_code == 200
    assert data["date"] == "2026-02-07T18:57:38.803000"
    assert data["description"] == "Test description"
    assert data["category"] == "Test category"
    assert data["amount"] == 99.99