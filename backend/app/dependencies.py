from typing import Annotated

from fastapi import Depends

from app.models.user import User
from app.services.users import get_current_active_user

CurrentUser = Annotated[User, Depends(get_current_active_user)]
