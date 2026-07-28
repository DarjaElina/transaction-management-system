from sqlmodel import Session, text


def reset_database(session: Session):
    session.execute(
        text("""
        TRUNCATE TABLE
            transactions,
            categories
        RESTART IDENTITY CASCADE;
    """)
    )
    session.commit()
