from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import HTTPException, status
import jwt
from pwdlib import PasswordHash
from sqlmodel import Session, select

from app.models.user import User
from app.schemas.auth import Token
from app.config import get_settings

settings = get_settings()

SECRET_KEY = settings.secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

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


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(ZoneInfo("UTC")) + expires_delta
    else:
        expire = datetime.now(ZoneInfo("UTC")) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def login(session: Session, email: str, password: str) -> Token:
    user = authenticate_user(session, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
