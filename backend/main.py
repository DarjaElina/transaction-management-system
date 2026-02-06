from sqlmodel import Session, select
from fastapi import FastAPI
from db import create_db_and_tables, engine
from models import Transaction

app = FastAPI()

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello! :-)"}

@app.get("/transactions")
def read_transactions():
  with Session(engine) as session:
    transactions = session.exec(select(Transaction)).all()
    return transactions