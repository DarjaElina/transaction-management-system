import uuid

from sqlmodel import Session

from app.models.transaction import Transaction
from app.schemas.transactions import TransactionCreate
from app.exceptions import NotFoundError, ValidationError
from app.core.enums import TransactionType
from app.services.utils import (
    validate_category_for_transaction,
    apply_sorting,
    filter_equal,
    filter_ilike,
    filter_gte,
    filter_lte,
)
from datetime import datetime, UTC
from decimal import Decimal

from app.models.user import User


def get_transactions(
    session: Session,
    current_user: User,
    category_id: uuid.UUID | None,
    transaction_type: TransactionType | None,
    description: str | None,
    start_date: datetime | None,
    end_date: datetime | None,
    min_amount: Decimal | None,
    max_amount: Decimal | None,
    sort_by: str,
    order: str,
):
    query = apply_sorting(Transaction, sort_by, order)

    query = filter_equal(query, Transaction.category_id, category_id)
    query = filter_equal(query, Transaction.transaction_type, transaction_type)
    query = filter_ilike(query, Transaction.description, description)
    query = filter_gte(query, Transaction.date, start_date)
    query = filter_lte(query, Transaction.date, end_date)
    query = filter_gte(query, Transaction.amount, min_amount)
    query = filter_lte(query, Transaction.amount, max_amount)

    return session.exec(query).all()


def get_transaction(session: Session, transaction_id, current_user: User):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise NotFoundError("Transaction", transaction_id)

    return transaction


def create_transaction(
    transaction: TransactionCreate, session: Session, current_user: User
):
    validate_category_for_transaction(
        transaction.category_id, transaction.transaction_type, session
    )

    if transaction.date >= datetime.now(UTC):
        raise ValidationError("date", "Transaction date must be in the past")

    db_transaction = Transaction.model_validate(transaction)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


def delete_transaction(session: Session, transaction_id, current_user: User):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise NotFoundError("Transaction", transaction_id)

    session.delete(transaction)
    session.commit()


def update_transaction(
    session: Session, transaction, transaction_id, current_user: User
):
    transaction_db = session.get(Transaction, transaction_id)

    if not transaction_db:
        raise NotFoundError("Transaction", transaction_id)

    if transaction.category_id is not None:
        new_type = (
            transaction.transaction_type
            if transaction.transaction_type is not None
            else transaction_db.transaction_type
        )
        validate_category_for_transaction(transaction.category_id, new_type, session)

    if transaction.date:
        if transaction.date >= datetime.now(UTC):
            raise ValidationError("date", "Transaction date must be in the past")

    transaction_data = transaction.model_dump(exclude_unset=True)
    transaction_db.sqlmodel_update(transaction_data)
    session.add(transaction_db)
    session.commit()
    session.refresh(transaction_db)
    return transaction_db
