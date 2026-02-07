from typing import Annotated
from fastapi import FastAPI, Query
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
