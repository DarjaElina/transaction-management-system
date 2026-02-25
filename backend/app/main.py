from fastapi import FastAPI
from .routers import transactions, categories
from fastapi.middleware.cors import CORSMiddleware

from .exception_handlers import register_exception_handlers

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router)
app.include_router(categories.router)
register_exception_handlers(app)


@app.get("/")
async def root():
    return {"message": "Hello! :-)"}
