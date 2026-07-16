from datetime import datetime
from decimal import Decimal

from sqlmodel import Session

from app.core.enums import TransactionType
from app.db.database import SessionDep, get_engine
from app.models.category import Category
from app.models.transaction import Transaction


def create_categories(session: SessionDep):
    categories = [
        Category(name="Food", allowed_type=TransactionType.EXPENSE),
        Category(name="Salary", allowed_type=TransactionType.INCOME),
        Category(name="Rent", allowed_type=TransactionType.EXPENSE),
        Category(name="Transport", allowed_type=TransactionType.EXPENSE),
        Category(name="Entertainment", allowed_type=TransactionType.EXPENSE),
        Category(name="Freelance", allowed_type=TransactionType.INCOME),
        Category(name="Shopping", allowed_type=TransactionType.EXPENSE),
        Category(name="Health", allowed_type=TransactionType.EXPENSE),
        Category(name="Education", allowed_type=TransactionType.EXPENSE),
        Category(name="Subscriptions", allowed_type=TransactionType.EXPENSE),
        Category(name="Travel", allowed_type=TransactionType.EXPENSE),
        Category(name="Home", allowed_type=TransactionType.EXPENSE),
    ]

    session.add_all(categories)
    session.commit()

    for c in categories:
        session.refresh(c)

    return categories


def create_transactions(session: SessionDep, categories):
    food = next(c for c in categories if c.name == "Food")
    salary = next(c for c in categories if c.name == "Salary")
    rent = next(c for c in categories if c.name == "Rent")
    transport = next(c for c in categories if c.name == "Transport")
    fun = next(c for c in categories if c.name == "Entertainment")
    freelance = next(c for c in categories if c.name == "Freelance")
    shopping = next(c for c in categories if c.name == "Shopping")
    health = next(c for c in categories if c.name == "Health")
    education = next(c for c in categories if c.name == "Education")
    subscriptions = next(c for c in categories if c.name == "Subscriptions")
    travel = next(c for c in categories if c.name == "Travel")
    home = next(c for c in categories if c.name == "Home")

    transactions = [
        Transaction(
            amount=Decimal("2000"),
            description="Salary Jan 2024",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2024, 1, 1),
        ),
        Transaction(
            amount=Decimal("800"),
            description="Rent Jan 2024",
            transaction_type=TransactionType.EXPENSE,
            category_id=rent.id,
            date=datetime(2024, 1, 3),
        ),
        Transaction(
            amount=Decimal("150"),
            description="Groceries",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2024, 1, 5),
        ),
        Transaction(
            amount=Decimal("2000"),
            description="Salary Feb 2024",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2024, 2, 1),
        ),
        Transaction(
            amount=Decimal("170"),
            description="Food Feb",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2024, 2, 10),
        ),
        Transaction(
            amount=Decimal("500"),
            description="Freelance project",
            transaction_type=TransactionType.INCOME,
            category_id=freelance.id,
            date=datetime(2024, 2, 15),
        ),
        Transaction(
            amount=Decimal("2200"),
            description="Salary June 2024",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2024, 6, 1),
        ),
        Transaction(
            amount=Decimal("900"),
            description="Rent June",
            transaction_type=TransactionType.EXPENSE,
            category_id=rent.id,
            date=datetime(2024, 6, 3),
        ),
        Transaction(
            amount=Decimal("300"),
            description="Weekend food & coffee",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2024, 6, 10),
        ),
        Transaction(
            amount=Decimal("120"),
            description="Transport card",
            transaction_type=TransactionType.EXPENSE,
            category_id=transport.id,
            date=datetime(2024, 6, 12),
        ),
        Transaction(
            amount=Decimal("2500"),
            description="Salary Jan 2025",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2025, 1, 1),
        ),
        Transaction(
            amount=Decimal("180"),
            description="Groceries Jan",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2025, 1, 5),
        ),
        Transaction(
            amount=Decimal("2500"),
            description="Salary Feb 2025",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2025, 2, 1),
        ),
        Transaction(
            amount=Decimal("220"),
            description="Food Feb",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2025, 2, 10),
        ),
        Transaction(
            amount=Decimal("600"),
            description="Freelance UI work",
            transaction_type=TransactionType.INCOME,
            category_id=freelance.id,
            date=datetime(2025, 2, 20),
        ),
        Transaction(
            amount=Decimal("2500"),
            description="Salary March 2025",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2025, 3, 1),
        ),
        Transaction(
            amount=Decimal("300"),
            description="Groceries March",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2025, 3, 18),
        ),
        Transaction(
            amount=Decimal("95"),
            description="Metro card",
            transaction_type=TransactionType.EXPENSE,
            category_id=transport.id,
            date=datetime(2025, 3, 20),
        ),
        Transaction(
            amount=Decimal("2700"),
            description="Salary June 2025",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2025, 6, 1),
        ),
        Transaction(
            amount=Decimal("950"),
            description="Rent June 2025",
            transaction_type=TransactionType.EXPENSE,
            category_id=rent.id,
            date=datetime(2025, 6, 3),
        ),
        Transaction(
            amount=Decimal("400"),
            description="Food June binge 😄",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2025, 6, 10),
        ),
        Transaction(
            amount=Decimal("200"),
            description="Concert + fun",
            transaction_type=TransactionType.EXPENSE,
            category_id=fun.id,
            date=datetime(2025, 6, 15),
        ),
        # =========================
        # Summer 2026 (recent data)
        # =========================
        Transaction(
            amount=Decimal("2800"),
            description="Salary June 2026",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2026, 6, 1),
        ),
        Transaction(
            amount=Decimal("980"),
            description="Rent June 2026",
            transaction_type=TransactionType.EXPENSE,
            category_id=rent.id,
            date=datetime(2026, 6, 2),
        ),
        Transaction(
            amount=Decimal("95"),
            description="Coffee with friends",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 6, 4),
        ),
        Transaction(
            amount=Decimal("180"),
            description="Groceries",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 6, 8),
        ),
        Transaction(
            amount=Decimal("75"),
            description="Bus pass",
            transaction_type=TransactionType.EXPENSE,
            category_id=transport.id,
            date=datetime(2026, 6, 11),
        ),
        Transaction(
            amount=Decimal("250"),
            description="Cinema & dinner",
            transaction_type=TransactionType.EXPENSE,
            category_id=fun.id,
            date=datetime(2026, 6, 14),
        ),
        Transaction(
            amount=Decimal("450"),
            description="Freelance landing page",
            transaction_type=TransactionType.INCOME,
            category_id=freelance.id,
            date=datetime(2026, 6, 18),
        ),
        Transaction(
            amount=Decimal("130"),
            description="Groceries",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 6, 22),
        ),
        Transaction(
            amount=Decimal("60"),
            description="Train ticket",
            transaction_type=TransactionType.EXPENSE,
            category_id=transport.id,
            date=datetime(2026, 6, 27),
        ),
        Transaction(
            amount=Decimal("2800"),
            description="Salary July 2026",
            transaction_type=TransactionType.INCOME,
            category_id=salary.id,
            date=datetime(2026, 7, 1),
        ),
        Transaction(
            amount=Decimal("980"),
            description="Rent July 2026",
            transaction_type=TransactionType.EXPENSE,
            category_id=rent.id,
            date=datetime(2026, 7, 2),
        ),
        Transaction(
            amount=Decimal("220"),
            description="Weekly groceries",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 7, 3),
        ),
        Transaction(
            amount=Decimal("48"),
            description="Ice cream 🍦",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 7, 2),
        ),
        Transaction(
            amount=Decimal("24"),
            description="Coffee",
            transaction_type=TransactionType.EXPENSE,
            category_id=food.id,
            date=datetime(2026, 7, 3),
        ),
        Transaction(
            amount=Decimal("310"),
            description="Freelance bugfix",
            transaction_type=TransactionType.INCOME,
            category_id=freelance.id,
            date=datetime(2026, 7, 4),
        ),
        Transaction(
            amount=Decimal("650"),
            description="New laptop",
            transaction_type=TransactionType.EXPENSE,
            category_id=shopping.id,
            date=datetime(2026, 7, 5),
        ),
        Transaction(
            amount=Decimal("250"),
            description="Doctor appointment",
            transaction_type=TransactionType.EXPENSE,
            category_id=health.id,
            date=datetime(2026, 7, 6),
        ),
        Transaction(
            amount=Decimal("400"),
            description="Online course",
            transaction_type=TransactionType.EXPENSE,
            category_id=education.id,
            date=datetime(2026, 7, 7),
        ),
        Transaction(
            amount=Decimal("35"),
            description="Netflix",
            transaction_type=TransactionType.EXPENSE,
            category_id=subscriptions.id,
            date=datetime(2026, 7, 8),
        ),
        Transaction(
            amount=Decimal("40"),
            description="Spotify",
            transaction_type=TransactionType.EXPENSE,
            category_id=subscriptions.id,
            date=datetime(2026, 7, 9),
        ),
        Transaction(
            amount=Decimal("1200"),
            description="Holiday trip",
            transaction_type=TransactionType.EXPENSE,
            category_id=travel.id,
            date=datetime(2026, 7, 10),
        ),
        Transaction(
            amount=Decimal("80"),
            description="Home decorations",
            transaction_type=TransactionType.EXPENSE,
            category_id=home.id,
            date=datetime(2026, 7, 11),
        ),
    ]

    session.add_all(transactions)
    session.commit()


def seed_database(session: SessionDep):
    categories = create_categories(session)
    create_transactions(session, categories)


def main():
    with Session(get_engine()) as session:
        seed_database(session)


if __name__ == "__main__":
    main()
