from pydantic import ConfigDict
from ..models.category import CategoryBase
from ..core.enums import TransactionType


class CategoryPublic(CategoryBase):
    id: int


class CategoryCreate(CategoryBase):
    model_config = ConfigDict(extra="forbid")


class CategoryUpdate(CategoryBase):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    description: str | None = None
    allowed_type: TransactionType | None = None
    is_active: bool | None = None
