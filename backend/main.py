from typing import Annotated
from fastapi import FastAPI, Query, HTTPException
from sqlmodel import select

from db import create_db_and_tables, engine, SessionDep
from models import Transaction, TransactionPublic, TransactionCreate, TransactionUpdate

app = FastAPI()

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello! :-)"}

@app.get("/transactions/", response_model=list[TransactionPublic])
def read_transactions(
  session: SessionDep,
  offset: int = 0,
  limit: Annotated[int, Query(le=100)] = 100,
):
  transactions = session.exec(select(Transaction).offset(offset).limit(limit)).all()
  return transactions

@app.get("/transactions/{transaction_id}", response_model=TransactionPublic)
def read_transaction(transaction_id: int, session: SessionDep):
  transaction = session.get(Transaction, transaction_id)
  if not transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  return transaction

@app.post("/transactions/", response_model=TransactionPublic)
def create_transaction(transaction: TransactionCreate, session: SessionDep):
  db_transaction = Transaction.model_validate(transaction)
  session.add(db_transaction)
  session.commit()
  session.refresh(db_transaction)
  return db_transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, session: SessionDep):
  transaction = session.get(Transaction, transaction_id)
  if not transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  session.delete(transaction)
  session.commit()
  return {"ok": True}

@app.patch("/transactions/{transaction_id}", response_model=TransactionPublic)
def update_transaction(transaction_id: int, transaction: TransactionUpdate, session: SessionDep):
  transaction_db = session.get(Transaction, transaction_id)
  if not transaction_db:
    raise HTTPException(status_code=404, detail="Transaction not found")
  transaction_data = transaction.model_dump(exclude_unset=True)
  transaction_db.sqlmodel_update(transaction_data)
  session.add(transaction_db)
  session.commit()
  session.refresh(transaction_db)
  return transaction_db