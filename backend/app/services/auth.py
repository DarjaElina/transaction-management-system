import uuid

import secrets
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from redis import Redis
from sqlmodel import Session
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.config import get_settings
from app.schemas.users import UserCreate
from app.exceptions import AuthenticationError, ConflictError
from app.services.auth_utils import (
    authenticate_user,
    create_token,
    delete_redis_session,
    get_password_hash,
    get_redis_session,
    get_user,
    verify_token,
)

settings = get_settings()


def login(
    session: Session,
    email: str,
    password: str,
    redis_client: Redis,
):
    user = authenticate_user(session, email, password)

    if not user:
        raise AuthenticationError("Incorrect email or password")

    session_id = secrets.token_urlsafe(32)
    create_redis_session(session_id, user_id=user.id, redis_client=redis_client)

    access_token = create_token(
        data={"sub": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    refresh_token = create_token(
        data={"sub": user.email, "type": "refresh", "session_id": session_id},
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )

    return access_token, refresh_token


def signup(session: Session, user: UserCreate):
    user_data = user.model_dump(exclude={"password"})

    db_user = User(
        **user_data,
        password_hash=get_password_hash(user.password),
    )

    session.add(db_user)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise ConflictError("Email")

    session.refresh(db_user)

    return db_user


def refresh(session: Session, refresh_token: str, redis_client: Redis):
    email, session_id, type = verify_token(refresh_token)
    if not type or type != "refresh":
        raise AuthenticationError()

    user = get_user(
        session,
        email=email,
    )

    if user is None:
        raise AuthenticationError()

    if session_id is None:
        raise AuthenticationError()

    redis_session = get_redis_session(session_id, redis_client)

    if redis_session is None:
        raise AuthenticationError()

    access_token = create_token(
        data={"sub": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    new_session_id = secrets.token_urlsafe(32)
    delete_redis_session(session_id, redis_client)
    create_redis_session(new_session_id, user_id=user.id, redis_client=redis_client)

    new_refresh_token = create_token(
        data={"sub": user.email, "type": "refresh", "session_id": new_session_id},
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )

    return access_token, new_refresh_token


def create_redis_session(session_id: str, user_id: uuid.UUID, redis_client: Redis):
    created_at = datetime.now(ZoneInfo("UTC"))
    redis_client.hset(
        f"user-session:{str(session_id)}",
        mapping={
            "user_id": str(user_id),
            "created_at": str(created_at),
        },
    )
    redis_client.expire(
        f"user-session:{str(session_id)}",
        timedelta(days=settings.refresh_token_expire_days),
    )


def logout(session_id: str, redis_client: Redis):
    delete_redis_session(session_id, redis_client)
