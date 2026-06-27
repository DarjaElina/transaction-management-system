from pydantic import AwareDatetime, ConfigDict
from decimal import Decimal

from sqlmodel import SQLModel
from app.models.transaction import TransactionBase
from app.core.enums import TransactionType
from app.schemas.categories import CategoryPublic
import uuid


class TransactionPublic(TransactionBase):
    id: uuid.UUID
    date: AwareDatetime


class TransactionPublicWithCategory(TransactionPublic):
    category: CategoryPublic | None = None


class TransactionCreate(TransactionBase):
    date: AwareDatetime

    model_config = ConfigDict(extra="forbid")  # type: ignore


class TransactionUpdate(SQLModel):
    date: AwareDatetime | None = None
    description: str | None = None
    category_id: uuid.UUID | None = None
    amount: Decimal | None = None
    transaction_type: TransactionType | None = None

    model_config = ConfigDict(extra="forbid")  # type: ignore
