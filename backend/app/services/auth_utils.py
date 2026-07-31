from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import Cookie
import jwt
from pwdlib import PasswordHash
from redis import Redis
from sqlmodel import Session, select

from app.config import get_settings
from app.models.user import User
from app.exceptions import AuthenticationError

settings = get_settings()

password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword")


def verify_password(plain_password, hashed_password):
    return password_hash.verify(plain_password, hashed_password)


def get_password_hash(password):
    return password_hash.hash(password)


def authenticate_user(session: Session, email: str, password: str):
    user = get_user(session, email)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user


def get_user(session: Session, email: str):
    stmt = select(User).where(User.email == email)
    result = session.exec(stmt)
    user = result.first()

    return user


def create_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(ZoneInfo("UTC")) + expires_delta
    else:
        expire = datetime.now(ZoneInfo("UTC")) + timedelta(minutes=15)
    to_encode.update({"exp": expire, "iat": datetime.now(ZoneInfo("UTC"))})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


def verify_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )

        email = payload.get("sub")
        session_id = payload.get("session_id")
        type = payload.get("type")

        if email is None:
            raise AuthenticationError("Could not validate credentials")

        return email, session_id, type

    except jwt.InvalidTokenError:
        raise AuthenticationError("Could not validate credentials")


def get_refresh_token(
    refresh_token: str | None = Cookie(default=None),
):
    if refresh_token is None:
        raise AuthenticationError("Authentication failed")

    return refresh_token


def get_session_id_from_refresh_token(token):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )

    except jwt.InvalidTokenError:
        raise AuthenticationError("Authentication failed")

    return payload["session_id"]


def get_redis_session(session_id: str, redis_client: Redis):
    session = redis_client.hgetall(f"user-session:{session_id}")

    return session


def delete_redis_session(session_id: str, redis_client: Redis):
    redis_client.delete(f"user-session:{session_id}")
