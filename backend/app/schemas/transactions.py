from pydantic import ConfigDict
from datetime import datetime
from decimal import Decimal
from ..models.transaction import TransactionBase
from ..core.enums import TransactionType


class TransactionPublic(TransactionBase):
    id: int


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(extra="forbid")


class TransactionUpdate(TransactionBase):
    model_config = ConfigDict(extra="forbid")

    date: datetime | None = None
    description: str | None = None
    category_id: str | None = None
    amount: Decimal | None = None
    transaction_type: TransactionType | None = None
