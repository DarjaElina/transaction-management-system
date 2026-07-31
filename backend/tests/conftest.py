import uuid

import fakeredis
import pytest
from sqlmodel import Session, SQLModel, create_engine
from fastapi.testclient import TestClient

from app.main import app
from app.db.database import get_redis, get_session
from app.config import get_settings
from app.models.user import User
from app.services.users import get_current_active_user


@pytest.fixture(scope="session")
def engine():
    settings = get_settings()

    engine = create_engine(settings.database_url, echo=True)

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


@pytest.fixture
def user(session):
    user = User(
        id=uuid.uuid4(),
        email="test@test.com",
        first_name="John",
        last_name="Doe",
        password_hash="hash",
        disabled=False,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@pytest.fixture
def create_user(session):
    def _create_user(email: str):
        user = User(
            id=uuid.uuid4(),
            email=email,
            first_name="John",
            last_name="Doe",
            password_hash="hash",
            disabled=False,
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return user

    return _create_user


@pytest.fixture
def redis_client():
    return fakeredis.FakeRedis()


@pytest.fixture(name="client")
def client_fixture(session: Session, user: User, redis_client: fakeredis.FakeRedis):
    def get_session_override():
        return session

    def get_current_active_user_override():
        return user

    def get_redis_override():
        return redis_client

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[get_current_active_user] = get_current_active_user_override
    app.dependency_overrides[get_redis] = get_redis_override

    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


@pytest.fixture(name="auth_client")
def auth_client_fixture(
    session: Session,
    redis_client,
):
    def get_session_override():
        return session

    def get_redis_override():
        return redis_client

    app.dependency_overrides[get_session] = get_session_override
    app.dependency_overrides[get_redis] = get_redis_override

    client = TestClient(app)

    yield client

    app.dependency_overrides.clear()
