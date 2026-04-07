from fastapi import APIRouter, Query, HTTPException
from ..schemas.transactions import (
    TransactionPublic,
    TransactionPublicWithCategory,
    TransactionCreate,
    TransactionUpdate,
)
from datetime import datetime
from decimal import Decimal
from typing import Annotated, Literal
from ..db.database import SessionDep

from ..services import transaction_service

from ..core.enums import TransactionType

router = APIRouter(prefix="/transactions")


@router.get("/", response_model=list[TransactionPublicWithCategory])
def read_transactions(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(ge=0, le=100)] = 20,
    category_id: int | None = None,
    transaction_type: TransactionType | None = None,
    description: str | None = None,
    start_date: datetime | None = None,
    end_date: datetime | None = None,
    min_amount: Decimal | None = None,
    max_amount: Decimal | None = None,
    sort_by: Literal["date", "amount"] = "date",
    order: Literal["asc", "desc"] = "desc",
):
    return transaction_service.get_transactions(
        session=session,
        offset=offset,
        limit=limit,
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
def read_transaction(transaction_id: int, session: SessionDep):
    transaction = transaction_service.get_transaction(session, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.post("/", response_model=TransactionPublicWithCategory)
def create_transaction(transaction: TransactionCreate, session: SessionDep):
    db_transaction = transaction_service.create_transaction(transaction, session)
    return db_transaction


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, session: SessionDep):
    transaction_service.delete_transaction(session, transaction_id)
    return {"ok": True}


@router.patch("/{transaction_id}", response_model=TransactionPublic)
def update_transaction(
    transaction_id: int, transaction: TransactionUpdate, session: SessionDep
):
    db_transaction = transaction_service.update_transaction(
        session, transaction, transaction_id
    )
    return db_transaction
