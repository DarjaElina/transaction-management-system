from fastapi import Cookie, Depends, HTTPException, status
from typing import Annotated

from app.models.user import User
from app.db.database import SessionDep
from app.services.auth import get_user, verify_token


def get_access_token(
    access_token: str | None = Cookie(default=None),
):
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return access_token


def get_current_user(
    session: SessionDep,
    access_token: Annotated[str, Depends(get_access_token)],
):
    email, _, _ = verify_token(access_token)

    user = get_user(
        session,
        email=email,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return user


def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
