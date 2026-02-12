from fastapi import FastAPI
from .routers import transactions, categories

app = FastAPI()

app.include_router(transactions.router)
app.include_router(categories.router)


@app.get("/")
async def root():
    return {"message": "Hello! :-)"}
