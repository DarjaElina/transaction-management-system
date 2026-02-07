from typing import Annotated
from fastapi import FastAPI, Query, HTTPException
from sqlmodel import select

from db import create_db_and_tables, engine, SessionDep
from models import Transaction

app = FastAPI()

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello! :-)"}

@app.get("/transactions/")
def read_transactions(
  session: SessionDep,
  offset: int = 0,
  limit: Annotated[int, Query(le=100)] = 100,
) -> list[Transaction]:
  transactions = session.exec(select(Transaction).offset(offset).limit(limit)).all()
  return transactions

@app.get("/transactions/{transaction_id}")
def read_transaction(transaction_id: int, session: SessionDep) -> Transaction:
  transaction = session.get(Transaction, transaction_id)
  if not transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  return transaction

@app.post("/transactions/")
def create_transaction(transaction: Transaction, session: SessionDep) -> Transaction:
  session.add(transaction)
  session.commit()
  session.refresh(transaction)
  return transaction

@app.delete("/transactions/{transaction_id}")
def delete_transaction(transaction_id: int, session: SessionDep):
  transaction = session.get(Transaction, transaction_id)
  if not transaction:
    raise HTTPException(status_code=404, detail="Transaction not found")
  session.delete(transaction)
  session.commit()
  return {"ok": True}