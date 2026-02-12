from fastapi import FastAPI
from .routers import transactions, categories

from .exception_handlers import register_exception_handlers

app = FastAPI()

app.include_router(transactions.router)
app.include_router(categories.router)
register_exception_handlers(app)


@app.get("/")
async def root():
    return {"message": "Hello! :-)"}
