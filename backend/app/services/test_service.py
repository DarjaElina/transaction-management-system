from ..db.database import SessionDep
from sqlmodel import text


def reset_database(session: SessionDep):
    session.execute(
        text("""
        TRUNCATE TABLE
            transactions,
            categories
        RESTART IDENTITY CASCADE;
    """)
    )
    session.commit()
