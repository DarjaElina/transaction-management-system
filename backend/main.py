from fastapi import FastAPI
from routers import transaction_router

from db import create_db_and_tables

app = FastAPI()

app.include_router(transaction_router)

@app.on_event("startup")
def on_startup():
  create_db_and_tables()

@app.get("/")
async def root():
    return {"message": "Hello! :-)"}