from fastapi import APIRouter
from app.services import test_service
from app.db.database import SessionDep

router = APIRouter(prefix="/test")


@router.post("/reset")
def reset_db(session: SessionDep):
    test_service.reset_database(session)
    return {"ok": True}
