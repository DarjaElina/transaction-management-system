from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.services import auth_service
from app.db.database import SessionDep
from app.schemas.auth import Token


router = APIRouter(prefix="/auth")


@router.post("/token", response_model=Token)
async def login(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    token = await auth_service.login(session, form_data)
    return token
