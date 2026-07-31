from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select
from app.models.category import Category
from app.schemas.categories import CategoryCreate
from app.db.database import SessionDep
from app.exceptions import NotFoundError, ConflictError
from app.core.enums import TransactionType
from app.services.utils import (
    apply_sorting,
    filter_equal,
    filter_ilike,
    validate_and_normalize_category_name,
)
from app.models.user import User


def get_categories(
    session: Session,
    user: User,
    offset: int,
    limit: int,
    name: str | None,
    is_active: bool | None,
    allowed_type: TransactionType | None,
    sort_by: str,
    order: str,
):
    query = select(Category).where(Category.user_id == user.id)

    query = apply_sorting(Category, sort_by, order)

    query = filter_ilike(query, Category.name, name)
    query = filter_equal(query, Category.is_active, is_active)
    query = filter_equal(query, Category.allowed_type, allowed_type)

    return session.exec(query.offset(offset).limit(limit)).all()


def get_category(
    session: Session,
    category_id,
    user: User,
):
    stmt = select(Category).where(
        Category.user_id == user.id, Category.id == category_id
    )
    category = session.exec(stmt).first()

    if not category:
        raise NotFoundError("Category", category_id)

    return category


def create_category(category: CategoryCreate, session: Session, user: User):
    db_name = validate_and_normalize_category_name(category.name, session)
    category.name = db_name

    db_category = Category.model_validate(category, update={"user_id": user.id})

    session.add(db_category)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise ConflictError("Category")

    session.refresh(db_category)

    return db_category


def delete_category(
    session: Session,
    category_id,
    user: User,
):
    stmt = select(Category).where(
        Category.user_id == user.id, Category.id == category_id
    )
    category = session.exec(stmt).first()

    if not category:
        raise NotFoundError("Category", category_id)

    session.delete(category)
    session.commit()


def update_category(
    session: SessionDep,
    category,
    category_id,
    user: User,
):
    stmt = select(Category).where(
        Category.user_id == user.id, Category.id == category_id
    )
    category_db = session.exec(stmt).first()

    if not category_db:
        raise NotFoundError("Category", category_id)

    if category.name:
        db_name = validate_and_normalize_category_name(category.name, session)

        category.name = db_name

    if category.allowed_type is not None:
        if category_db.transactions:
            raise ConflictError(
                "Category", "Cannot change allowed type because transactions exist"
            )

    category_data = category.model_dump(exclude_unset=True)
    category_db.sqlmodel_update(category_data)

    session.add(category_db)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise ConflictError("Category")

    session.refresh(category_db)

    return category_db
