import os
from dotenv import load_dotenv
import pytest
from sqlmodel import Session, SQLModel, create_engine
from fastapi.testclient import TestClient

from app.main import app
from app.db.database import get_session

load_dotenv()


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(os.getenv("TEST_DATABASE_URL"), echo=True)
    SQLModel.metadata.create_all(engine)
    yield engine
    SQLModel.metadata.drop_all(engine)


@pytest.fixture
def session(engine):
    connection = engine.connect()
    transaction = connection.begin()

    session = Session(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()
