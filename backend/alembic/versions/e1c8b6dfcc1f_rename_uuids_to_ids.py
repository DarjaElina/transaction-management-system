"""rename UUIDs to IDs

Revision ID: e1c8b6dfcc1f
Revises: a5596e7755a6
Create Date: 2026-04-07 14:19:43.048602

"""

from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = "e1c8b6dfcc1f"
down_revision: Union[str, Sequence[str], None] = "a5596e7755a6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column("categories", "category_uuid", new_column_name="id")
    op.alter_column("transactions", "transaction_uuid", new_column_name="id")

    # Rename UUID FK column in transactions
    op.alter_column("transactions", "category_uuid", new_column_name="category_id")
    pass


def downgrade() -> None:
    op.alter_column("transactions", "category_id", new_column_name="category_uuid")
    op.alter_column("transactions", "id", new_column_name="transaction_uuid")
    op.alter_column("categories", "id", new_column_name="category_uuid")
    pass
