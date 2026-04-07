"""drop old int IDs

Revision ID: a5596e7755a6
Revises: 768c3c2f3466
Create Date: 2026-04-07 14:18:32.947513

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a5596e7755a6"
down_revision: Union[str, Sequence[str], None] = "768c3c2f3466"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("transactions", "category_id")
    op.drop_column("categories", "id")
    op.drop_column("transactions", "id")
    pass


def downgrade() -> None:
    op.add_column(
        "categories",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
    )
    op.add_column(
        "transactions",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
    )
    op.add_column("transactions", sa.Column("category_id", sa.Integer(), nullable=True))
    pass
