from pydantic import ConfigDict
from sqlmodel import SQLModel
from ..models.category import CategoryBase
from ..core.enums import TransactionType
import uuid


class CategoryPublic(CategoryBase):
    id: uuid.UUID


class CategoryCreate(CategoryBase):
    model_config = ConfigDict(extra="forbid")  # type: ignore


class CategoryUpdate(SQLModel):
    name: str | None = None
    description: str | None = None
    allowed_type: TransactionType | None = None
    is_active: bool | None = None

    model_config = ConfigDict(extra="forbid")  # type: ignore
