import uuid

import jwt
import secrets
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import Cookie, HTTPException, status
from pwdlib import PasswordHash
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.config import get_settings
from app.schemas.users import UserCreate
from app.exceptions import ConflictError
from app.db.database import SessionDep, get_redis

settings = get_settings()

password_hash = PasswordHash.recommended()

DUMMY_HASH = password_hash.hash("dummypassword")

r = get_redis()


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
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key.get_secret_value(),
        algorithm=settings.jwt_algorithm,
    )
    return encoded_jwt


def verify_token(token: str) -> tuple[str, str | None]:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.jwt_algorithm],
        )

        email = payload.get("sub")
        session_id = payload.get("session_id")

        if email is None:
            raise credentials_exception

        return email, session_id

    except jwt.InvalidTokenError:
        raise credentials_exception


def login(session: Session, email: str, password: str):
    user = authenticate_user(session, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    session_id = secrets.token_urlsafe(32)
    create_redis_session(
        session_id,
        user_id=user.id,
    )

    access_token = create_token(
        data={"sub": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    refresh_token = create_token(
        data={"sub": user.email, "type": "refresh", "session_id": session_id},
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )

    return access_token, refresh_token, session_id


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
        raise ConflictError("email")

    session.refresh(db_user)

    return db_user


def get_refresh_token(
    refresh_token: str | None = Cookie(default=None),
):
    if refresh_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return refresh_token


def refresh(session: SessionDep, refresh_token: str) -> tuple[str, str]:
    email, session_id = verify_token(refresh_token)
    user = get_user(
        session,
        email=email,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    if session_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    redis_session = get_redis_session(session_id)

    if redis_session is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    access_token = create_token(
        data={"sub": user.email, "type": "access"},
        expires_delta=timedelta(minutes=settings.access_token_expire_minutes),
    )

    new_session_id = secrets.token_urlsafe(32)
    delete_redis_session(session_id)
    create_redis_session(
        new_session_id,
        user_id=user.id,
    )

    new_refresh_token = create_token(
        data={"sub": user.email, "type": "refresh", "session_id": new_session_id},
        expires_delta=timedelta(days=settings.refresh_token_expire_days),
    )

    return access_token, new_refresh_token


def create_redis_session(
    session_id: str,
    user_id: uuid.UUID,
):
    created_at = datetime.now(ZoneInfo("UTC"))
    r.hset(
        f"user-session:{str(session_id)}",
        mapping={
            "user_id": str(user_id),
            "created_at": str(created_at),
        },
    )
    r.expire(
        f"user-session:{str(session_id)}",
        timedelta(days=settings.refresh_token_expire_days),
    )


def get_redis_session(session_id: str):
    session = r.hgetall(f"user-session:{session_id}")

    return session


def delete_redis_session(session_id: str):
    r.delete(f"user-session:{session_id}")


def logout(session_id: str):
    delete_redis_session(session_id)
