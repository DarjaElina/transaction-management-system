from fastapi import APIRouter
from app.services import test
from app.db.database import SessionDep, RedisDep

router = APIRouter(prefix="/test")


@router.post("/reset")
def reset_test_env(session: SessionDep, redis: RedisDep):
    test.reset_test_env(session, redis)
    return {"ok": True}
