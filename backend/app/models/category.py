from sqlmodel import Field, SQLModel, Column, Relationship
from .enums import TransactionType
from .transaction import Transaction
from sqlalchemy.dialects import postgresql


class CategoryBase(SQLModel):
    name: str = Field(index=True, sa_column_kwargs={"unique": True})
    description: str | None = Field(default=None)
    allowed_type: TransactionType = Field(
        sa_column=Column(
            postgresql.ENUM(TransactionType, create_type=False), nullable=False
        )
    )
    is_active: bool = Field(default=True)

    __tablename__ = "categories"


class Category(CategoryBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    transactions: list["Transaction"] = Relationship(back_populates="category")


class CategoryPublic(CategoryBase):
    id: int


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    name: str | None = None
    description: str | None = None
    allowed_type: TransactionType | None = None
    is_active: bool | None = None
