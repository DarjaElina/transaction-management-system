import jwt
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from fastapi import HTTPException, status
from pwdlib import PasswordHash
from sqlmodel import Session, select
from sqlalchemy.exc import IntegrityError

from app.models.user import User
from app.config import get_settings
from app.schemas.users import UserCreate
from app.exceptions import ConflictError

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


def verify_access_token(token: str) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        email = payload.get("sub")

        if email is None:
            raise credentials_exception

        return email

    except jwt.InvalidTokenError:
        raise credentials_exception


async def login(session: Session, email: str, password: str) -> str:
    user = authenticate_user(session, email, password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return access_token


async def signup(session: Session, user: UserCreate):
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
