from typing import Annotated

from fastapi import APIRouter
from fastapi.params import Depends

from app.schemas.users import UserPublic
from app.services.user_service import get_current_user


router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserPublic)
async def read_users_me(current_user: Annotated[UserPublic, Depends(get_current_user)]):
    return current_user
