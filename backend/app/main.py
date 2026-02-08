from contextlib import asynccontextmanager
from fastapi import FastAPI
from .routers import transactions

from .db.init_db import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(transactions.router)


@app.get("/")
async def root():
    return {"message": "Hello! :-)"}
