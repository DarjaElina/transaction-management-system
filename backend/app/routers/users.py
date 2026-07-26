from fastapi import APIRouter

from app.schemas.users import UserPublic
from app.dependencies import CurrentUser

router = APIRouter(prefix="/users")


@router.get("/me", response_model=UserPublic)
async def read_users_me(
    current_user: CurrentUser,
):
    return current_user
