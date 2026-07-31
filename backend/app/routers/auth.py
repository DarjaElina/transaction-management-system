from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response

from app.services import auth
from app.db.database import RedisDep, SessionDep
from app.schemas.users import UserCreate, UserPublic
from app.schemas.auth import LoginRequest
from app.config import get_settings

router = APIRouter(prefix="/auth")

settings = get_settings()


@router.post("/signup", response_model=UserPublic)
def signup(
    user: UserCreate,
    session: SessionDep,
):
    return auth.signup(session, user)


@router.post("/login")
def login(
    response: Response,
    session: SessionDep,
    redis_client: RedisDep,
    data: LoginRequest,
):
    access_token, refresh_token = auth.login(
        session, email=data.email, password=data.password, redis_client=redis_client
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 86400,
    )

    return {"message": "Successfully logged in"}


@router.post("/logout")
def logout(
    response: Response,
    redis_client: RedisDep,
    refresh_token: str | None = Cookie(default=None),
):
    session_id = auth.get_session_id_from_refresh_token(refresh_token)

    auth.logout(session_id, redis_client)

    response.delete_cookie(
        key="access_token",
    )

    response.delete_cookie(
        key="refresh_token",
    )

    return {"message": "Successfully logged out"}


@router.post("/token/refresh")
def refresh(
    response: Response,
    session: SessionDep,
    redis_client: RedisDep,
    refresh_token: Annotated[str, Depends(auth.get_refresh_token)],
):
    access_token, new_refresh_token = auth.refresh(session, refresh_token, redis_client)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.access_token_expire_minutes * 60,
    )

    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 86400,
    )

    return {"message": "Ok"}
