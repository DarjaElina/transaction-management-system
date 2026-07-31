from fastapi.testclient import TestClient
import pytest
from sqlmodel import Session, select

from app.models.user import User
from app.services.auth import (
    get_password_hash,
    get_session_id_from_refresh_token,
    verify_password,
)


@pytest.fixture
def user(session: Session):
    user = User(
        email="test@example.com",
        first_name="Jane",
        last_name="Doe",
        disabled=False,
        password_hash=get_password_hash("secret"),
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


def login(auth_client):
    return auth_client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "secret",
        },
    )


def test_login_success(auth_client: TestClient, user):
    response = login(auth_client)

    assert response.status_code == 200

    assert "access_token" in response.cookies
    assert "refresh_token" in response.cookies


def test_login_wrong_password(auth_client, user):
    login_response = auth_client.post(
        "/api/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrong",
        },
    )

    assert login_response.status_code == 401


def test_login_unknown_user(auth_client, user):
    login_response = auth_client.post(
        "/api/auth/login",
        json={
            "email": "wrond@example.com",
            "password": "secret",
        },
    )

    assert login_response.status_code == 401


def test_signup_success(auth_client, session):
    response = auth_client.post(
        "/api/auth/signup",
        json={
            "email": "new@test.com",
            "first_name": "John",
            "last_name": "Doe",
            "password": "secret",
        },
    )

    assert response.status_code == 200

    user = session.exec(select(User).where(User.email == "new@test.com")).first()

    assert user is not None
    assert verify_password("secret", user.password_hash)


def test_signup_duplicate_email(auth_client, user):
    response = auth_client.post(
        "/api/auth/signup",
        json={
            "email": user.email,
            "first_name": "Other",
            "last_name": "User",
            "password": "secret",
        },
    )

    assert response.status_code == 409


def test_current_user_requires_auth(auth_client):
    response = auth_client.get("/api/users/me")

    assert response.status_code == 401


def test_refresh_token(auth_client, redis_client, user):
    login_response = login(auth_client)

    old_refresh = login_response.cookies["refresh_token"]

    response = auth_client.post("/api/auth/token/refresh")

    assert response.status_code == 200

    new_refresh = response.cookies["refresh_token"]

    assert new_refresh != old_refresh


def test_refresh_rotates_session(auth_client, redis_client, user):
    login_response = login(auth_client)

    refresh_token = login_response.cookies["refresh_token"]

    old_session_id = get_session_id_from_refresh_token(refresh_token)

    assert redis_client.exists(f"user-session:{old_session_id}")

    auth_client.post("/api/auth/token/refresh")

    assert not redis_client.exists(f"user-session:{old_session_id}")


def test_logout(auth_client, redis_client, user):
    login_response = login(auth_client)

    refresh_token = login_response.cookies["refresh_token"]

    session_id = get_session_id_from_refresh_token(refresh_token)

    response = auth_client.post("/api/auth/logout")

    assert response.status_code == 200

    assert not redis_client.exists(f"user-session:{session_id}")


def test_refresh_requires_auth(auth_client):
    response = auth_client.post("/api/auth/token/refresh")

    assert response.status_code == 401


def test_logout_requires_auth(auth_client):
    response = auth_client.post("/api/auth/logout")

    assert response.status_code == 401
