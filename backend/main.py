from fastapi import FastAPI
from models import Transaction
from datetime import date
from typing import List

app = FastAPI()

test_transaction = Transaction(id=1, date=date(2025, 2, 6), description="Test transaction", category="Food", amount=25.5)

transactions: List[Transaction] = []

transactions.append(test_transaction)

@app.get("/")
async def root():
    return {"message": "Hello! :-)"}

@app.get("/transactions")
def read_transactions():
  return transactions
