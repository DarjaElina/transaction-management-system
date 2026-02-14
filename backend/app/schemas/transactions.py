from pydantic import ConfigDict, AwareDatetime
from decimal import Decimal
from ..models.transaction import TransactionBase
from ..core.enums import TransactionType


class TransactionPublic(TransactionBase):
    id: int
    date: AwareDatetime


class TransactionCreate(TransactionBase):
    model_config = ConfigDict(extra="forbid")
    date: AwareDatetime


class TransactionUpdate(TransactionBase):
    model_config = ConfigDict(extra="forbid")

    date: AwareDatetime | None = None
    description: str | None = None
    category_id: int | None = None
    amount: Decimal | None = None
    transaction_type: TransactionType | None = None
