from redis import Redis
from sqlmodel import Session, text


def reset_test_env(session: Session, redis: Redis):
    session.execute(
        text("""
        TRUNCATE TABLE
            transactions,
            categories,
            users
        RESTART IDENTITY CASCADE;
        """)
    )
    session.commit()

    redis.flushdb()
