from fastapi import Cookie, Depends, HTTPException, status
from typing import Annotated

from app.models.user import User
from app.db.database import SessionDep
from app.services.auth import get_user, verify_access_token


async def get_access_token(
    access_token: str | None = Cookie(default=None),
):
    if access_token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return access_token


async def get_current_user(
    session: SessionDep,
    access_token: Annotated[str, Depends(get_access_token)],
):
    token_data = verify_access_token(access_token)

    user = get_user(
        session,
        email=token_data,
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
