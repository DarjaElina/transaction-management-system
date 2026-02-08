from sqlmodel import SQLModel
from .database import engine

def create_db_and_tables():
  SQLModel.metadata.create_all(engine) # create_all() does not need to accept models to create tables, because every model inherited from SQLModel that has table=True (check models/transactions.py) is already stored in SQLModel.metadata