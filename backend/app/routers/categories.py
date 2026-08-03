from fastapi import APIRouter, HTTPException
from app.schemas.categories import (
    CategoryPublic,
    CategoryCreate,
    CategoryUpdate,
)
from app.dependencies import CurrentUser
from ..db.database import SessionDep

from app.services import categories
from ..core.enums import TransactionType
from typing import Literal

import uuid

router = APIRouter(prefix="/categories")


@router.get("", response_model=list[CategoryPublic])
def read_categories(
    session: SessionDep,
    user: CurrentUser,
    name: str | None = None,
    is_active: bool | None = None,
    allowed_type: TransactionType | None = None,
    sort_by: Literal["name"] = "name",
    order: Literal["asc", "desc"] = "desc",
):
    return categories.get_categories(
        session=session,
        user=user,
        name=name,
        is_active=is_active,
        allowed_type=allowed_type,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{category_id}", response_model=CategoryPublic)
def read_category(category_id: uuid.UUID, session: SessionDep, user: CurrentUser):
    category = categories.get_category(session, category_id, user)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("", response_model=CategoryPublic)
def create_category(category: CategoryCreate, session: SessionDep, user: CurrentUser):
    db_category = categories.create_category(category, session, user)
    return db_category


@router.delete("/{category_id}")
def delete_category(category_id: uuid.UUID, session: SessionDep, user: CurrentUser):
    categories.delete_category(session, category_id, user)
    return {"ok": True}


@router.patch("/{category_id}", response_model=CategoryPublic)
def update_category(
    category_id: uuid.UUID,
    category: CategoryUpdate,
    session: SessionDep,
    user: CurrentUser,
):
    db_category = categories.update_category(session, category, category_id, user)
    return db_category
