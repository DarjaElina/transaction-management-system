from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import select

from app.db.database import SessionDep
from app.models.user import User
from app.schemas.auth import Token


def get_user(session: SessionDep, email: str):
    stmt = select(User).where(User.email == email)
    result = session.exec(stmt)
    user = result.first()

    return user


def fake_hash_password(password: str):
    return "fakehashed" + password


def fake_decode_token(session: SessionDep, token: str):
    # This doesn't provide any security at all
    # Check the next version
    user = get_user(session, token)
    return user


async def login(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = get_user(session, form_data.username)

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    password_hash = fake_hash_password(form_data.password)

    if not password_hash == user.password_hash:
        raise HTTPException(status_code=400, detail="Incorrect username or password")

    return Token(access_token=user.email, token_type="bearer")
