from fastapi import APIRouter, Response

from app.services import auth
from app.db.database import SessionDep
from app.schemas.users import UserCreate, UserPublic
from app.schemas.auth import LoginRequest

router = APIRouter(prefix="/auth")


@router.post("/signup", response_model=UserPublic)
async def signup(
    user: UserCreate,
    session: SessionDep,
):
    return await auth.signup(session, user)


@router.post("/login")
async def login(
    response: Response,
    session: SessionDep,
    data: LoginRequest,
):
    access_token = await auth.login(
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
        max_age=auth.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )

    return {"message": "Successfully logged in"}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="lax",
    )

    return {"message": "Successfully logged out"}
