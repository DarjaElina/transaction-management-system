from typing import Annotated
from fastapi import APIRouter, Query, HTTPException
from ..schemas.categories import (
    CategoryPublic,
    CategoryCreate,
    CategoryUpdate,
)
from ..db.database import SessionDep

from ..services import category_service
from ..core.enums import TransactionType
from typing import Literal

router = APIRouter(prefix="/categories")


@router.get("/", response_model=list[CategoryPublic])
def read_categories(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(ge=0, le=100)] = 20,
    name: str | None = None,
    is_active: bool | None = None,
    allowed_type: TransactionType | None = None,
    sort_by: Literal["name"] = "name",
    order: Literal["asc", "desc"] = "desc",
):
    return category_service.get_categories(
        session=session,
        offset=offset,
        limit=limit,
        name=name,
        is_active=is_active,
        allowed_type=allowed_type,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{category_id}", response_model=CategoryPublic)
def read_category(category_id: int, session: SessionDep):
    category = category_service.get_category(session, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.post("/", response_model=CategoryPublic)
def create_category(category: CategoryCreate, session: SessionDep):
    db_category = category_service.create_category(category, session)
    return db_category


@router.delete("/{category_id}")
def delete_category(category_id: int, session: SessionDep):
    category_service.delete_category(session, category_id)
    return {"ok": True}


@router.patch("/{category_id}", response_model=CategoryPublic)
def update_category(category_id: int, category: CategoryUpdate, session: SessionDep):
    db_category = category_service.update_category(session, category, category_id)
    return db_category
