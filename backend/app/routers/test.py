from fastapi import APIRouter
from app.services import test
from app.db.database import SessionDep

router = APIRouter(prefix="/test")


@router.post("/reset")
def reset_db(session: SessionDep):
    test.reset_database(session)
    return {"ok": True}
