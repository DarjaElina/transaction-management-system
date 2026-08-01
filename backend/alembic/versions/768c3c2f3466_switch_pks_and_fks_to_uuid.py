"""switch PKs and FKs to UUID

Revision ID: 768c3c2f3466
Revises: e9fbfb76ec75
Create Date: 2026-04-07 14:18:06.148517

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "768c3c2f3466"
down_revision: Union[str, Sequence[str], None] = "e9fbfb76ec75"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.drop_constraint(
        "transactions_category_id_fkey",
        "transactions",
        type_="foreignkey",
    )

    op.drop_constraint(
        "categories_pkey",
        "categories",
        type_="primary",
    )

    op.drop_constraint(
        "transactions_pkey",
        "transactions",
        type_="primary",
    )

    op.create_primary_key(
        "categories_pkey",
        "categories",
        ["category_uuid"],
    )

    op.create_primary_key(
        "transactions_pkey",
        "transactions",
        ["transaction_uuid"],
    )

    op.create_foreign_key(
        "transactions_category_uuid_fkey",
        "transactions",
        "categories",
        ["category_uuid"],
        ["category_uuid"],
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_constraint(
        "transactions_category_uuid_fkey",
        "transactions",
        type_="foreignkey",
    )

    op.drop_constraint(
        "transactions_pkey",
        "transactions",
        type_="primary",
    )

    op.drop_constraint(
        "categories_pkey",
        "categories",
        type_="primary",
    )

    op.create_primary_key(
        "categories_pkey",
        "categories",
        ["id"],
    )

    op.create_primary_key(
        "transactions_pkey",
        "transactions",
        ["id"],
    )

    op.create_foreign_key(
        "transactions_category_id_fkey",
        "transactions",
        "categories",
        ["category_id"],
        ["id"],
    )
