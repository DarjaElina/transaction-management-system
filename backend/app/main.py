from fastapi import FastAPI

from .config import get_settings
from .routers import transactions, categories, test
from fastapi.middleware.cors import CORSMiddleware

from .exception_handlers import register_exception_handlers

app = FastAPI()

settings = get_settings()

if settings.environment == "test":
    print("=====================================")
    print("Running in TEST mode 🧪")
    print(f"Test DB URL: {settings.database_url}")
    print("=====================================")

    app.include_router(test.router, prefix="/api")

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
register_exception_handlers(app)


@app.get("/")
async def root():
    return {"message": "Hello! :-)"}


@app.get("/health")
def health():
    return {"status": "ok"}
