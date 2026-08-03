from fastapi import APIRouter, HTTPException
from datetime import datetime
from decimal import Decimal
from typing import Literal
from app.db.database import SessionDep
from app.schemas.transactions import (
    TransactionPublic,
    TransactionPublicWithCategory,
    TransactionCreate,
    TransactionUpdate,
)
from app.dependencies import CurrentUser
from app.services import transactions

from ..core.enums import TransactionType
import uuid

router = APIRouter(prefix="/transactions")


@router.get("", response_model=list[TransactionPublicWithCategory])
def read_transactions(
    session: SessionDep,
    user: CurrentUser,
    category_id: uuid.UUID | None = None,
    transaction_type: TransactionType | None = None,
    description: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    min_amount: Decimal | None = None,
    max_amount: Decimal | None = None,
    sort_by: Literal["date", "amount"] = "date",
    order: Literal["asc", "desc"] = "desc",
):
    return transactions.get_transactions(
        session=session,
        user=user,
        category_id=category_id,
        transaction_type=transaction_type,
        description=description,
        start_date=start_date,
        end_date=end_date,
        min_amount=min_amount,
        max_amount=max_amount,
        sort_by=sort_by,
        order=order,
    )


@router.get("/{transaction_id}", response_model=TransactionPublic)
def read_transaction(transaction_id: uuid.UUID, session: SessionDep, user: CurrentUser):
    transaction = transactions.get_transaction(session, transaction_id, user)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.post("", response_model=TransactionPublicWithCategory)
def create_transaction(
    transaction: TransactionCreate, session: SessionDep, user: CurrentUser
):
    db_transaction = transactions.create_transaction(transaction, session, user)
    return db_transaction


@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: uuid.UUID, session: SessionDep, user: CurrentUser
):
    transactions.delete_transaction(session, transaction_id, user)
    return {"ok": True}


@router.patch("/{transaction_id}", response_model=TransactionPublicWithCategory)
def update_transaction(
    transaction_id: uuid.UUID,
    transaction: TransactionUpdate,
    session: SessionDep,
    user: CurrentUser,
):
    db_transaction = transactions.update_transaction(
        session, transaction, transaction_id, user
    )
    return db_transaction
