from sqlmodel import select
from fastapi import HTTPException
from ..models.transaction import Transaction
from ..schemas.transactions import TransactionCreate
from ..db.database import SessionDep


def get_transactions(session: SessionDep, offset=0, limit=100):
    return session.exec(select(Transaction).offset(offset).limit(limit)).all()


def get_transaction(session: SessionDep, transaction_id):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    return transaction


def create_transaction(transaction: TransactionCreate, session: SessionDep):
    db_transaction = Transaction.model_validate(transaction)
    session.add(db_transaction)
    session.commit()
    session.refresh(db_transaction)
    return db_transaction


def delete_transaction(session: SessionDep, transaction_id):
    transaction = session.get(Transaction, transaction_id)

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    session.delete(transaction)
    session.commit()


def update_transaction(session: SessionDep, transaction, transaction_id):
    transaction_db = session.get(Transaction, transaction_id)

    if not transaction_db:
        raise HTTPException(status_code=404, detail="Transaction not found")

    transaction_data = transaction.model_dump(exclude_unset=True)
    transaction_db.sqlmodel_update(transaction_data)
    session.add(transaction_db)
    session.commit()
    session.refresh(transaction_db)
    return transaction_db
