from fastapi import APIRouter
from ..services import test_service
from ..db.database import SessionDep

router = APIRouter(prefix="/test")


@router.post("/reset")
def reset_db(session: SessionDep):
    test_service.reset_database(session)
    return {"ok": True}
