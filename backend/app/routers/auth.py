from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status

from app.services import auth
from app.db.database import SessionDep
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
    data: LoginRequest,
):
    access_token, refresh_token, session_id = auth.login(
        session,
        email=data.email,
        password=data.password,
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

    response.set_cookie(
        key="session_id",
        value=session_id,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=settings.refresh_token_expire_days * 86400,
    )

    return {"message": "Successfully logged in"}


@router.post("/logout")
def logout(response: Response, session_id: str | None = Cookie(default=None)):
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
        )

    auth.logout(session_id)

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    response.delete_cookie(
        key="refresh_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    response.delete_cookie(
        key="session_id",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {"message": "Successfully logged out"}


@router.post("/token/refresh")
def refresh(
    response: Response,
    session: SessionDep,
    refresh_token: Annotated[str, Depends(auth.get_refresh_token)],
):
    access_token, new_refresh_token = auth.refresh(session, refresh_token)

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
