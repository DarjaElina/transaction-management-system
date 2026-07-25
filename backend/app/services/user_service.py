from fastapi import Depends, HTTPException, status
from typing import Annotated

from fastapi.security import OAuth2PasswordBearer

from app.models.user import User
from app.db.database import SessionDep
from app.services.auth_service import fake_decode_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token")


async def get_current_user(
    session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]
):
    user = fake_decode_token(session, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user


async def get_current_active_user(
    current_user: Annotated[User, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
