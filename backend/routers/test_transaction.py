import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from ..main import app
from ..db.database import get_session

# register a pytest fixture with name "session"
@pytest.fixture(name="session") # any test that has a parameter called `session` will recieve whatever this fixture yields
def session_fixture():
  engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
  )
  SQLModel.metadata.create_all(engine) # everything before yield is a setup
  with Session(engine) as session:
    yield session # give a created session to any test that has a param called `session``
    # after Python leaves the with block, session closes automatically

def test_create_transaction(session: Session):
  def get_session_override():
    return session

  app.dependency_overrides[get_session] = get_session_override # whenever app asks for session dependency,
  # give it the test session, instead of production one

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

# Fixture in pytest is a function that will give a value returned from that function, to any test that has a parameter with same name

# Simple example of fixture

@pytest.fixture(name="num") # any test with a parameter called num gets what this fixture returns
def my_fixture():
  return 10

def test_dummy(num):
  assert 10 + num == 20