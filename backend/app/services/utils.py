from sqlmodel import select
from sqlalchemy import asc, desc
from app.models.transaction import Category
from app.exceptions import NotFoundError, ValidationError, ConflictError


def validate_category_for_transaction(category_id, transaction_type, session):
    category = session.get(Category, category_id)
    if not category:
        raise NotFoundError("Category", category_id)

    if category.is_active is not True:
        raise ValidationError("category_id", "Category is inactive")

    if category.allowed_type != transaction_type:
        raise ValidationError(
            "transaction_type",
            f"Transaction of this type is not allowed for category {category.name}",
        )


def apply_sorting(model, sort_by, order):
    query = select(model)
    if order == "desc":
        ordering = desc(getattr(model, sort_by))
    else:
        ordering = asc(getattr(model, sort_by))

    query = query.order_by(ordering)
    return query


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
