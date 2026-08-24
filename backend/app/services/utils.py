from decimal import Decimal
import uuid

from sqlmodel import Session, select
from sqlalchemy import asc, desc
from app.models.transaction import Category
from app.exceptions import NotFoundError, ValidationError, ConflictError
from app.schemas.statistics import Change
from app.core.enums import TransactionType
from app.models.user import User


def validate_category_for_transaction(
    category_id: uuid.UUID,
    transaction_type: TransactionType,
    session: Session,
    user: User,
):
    category = session.get(Category, category_id)
    if not category:
        raise NotFoundError("Category", category_id)

    if category.user_id != user.id:
        raise NotFoundError("Category", category_id)

    if category.is_active is not True:
        raise ValidationError("category_id", "Category is inactive")

    if category.allowed_type != transaction_type:
        raise ValidationError(
            "transaction_type",
            f"Transaction of this type is not allowed for category {category.name}",
        )


def apply_sorting(query, model, sort_by, order):
    if order == "desc":
        ordering = desc(getattr(model, sort_by))
    else:
        ordering = asc(getattr(model, sort_by))

    return query.order_by(ordering)


def filter_equal(query, column, value):
    if value is not None:
        query = query.where(column == value)
    return query


def filter_ilike(query, column, value):
    if value:
        query = query.where(column.ilike(f"%{value}%"))
    return query


def filter_gte(query, column, value):
    if value is not None:
        query = query.where(column >= value)
    return query


def filter_lte(query, column, value):
    if value is not None:
        query = query.where(column <= value)
    return query


def validate_and_normalize_category_name(category_name, session, category_id=None):
    db_name = category_name.lower().strip()

    existing = session.exec(select(Category).where(Category.name == db_name)).first()

    if existing and existing.id != category_id:
        raise ConflictError("Category")

    return db_name


def get_change(previous: Decimal, current: Decimal):
    if previous == 0:
        return None

    return round((current - previous) / previous * 100, 1)


def to_change(previous: Decimal, current: Decimal) -> Change:
    return Change(
        current=current,
        previous=previous,
        change=get_change(previous, current),
    )


def calculate_cash_flow(
    income: Decimal,
    expense: Decimal,
):
    return income - expense


def calculate_savings_rate(
    income: Decimal,
    expense: Decimal,
):
    if income == 0:
        return Decimal("0")

    return round(
        (income - expense) / income * 100,
        1,
    )
