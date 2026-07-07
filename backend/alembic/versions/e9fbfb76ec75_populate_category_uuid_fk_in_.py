"""populate category_uuid FK in transactions

Revision ID: e9fbfb76ec75
Revises: d84405bd66ad
Create Date: 2026-04-07 14:16:23.583512

"""

from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "e9fbfb76ec75"
down_revision: Union[str, Sequence[str], None] = "d84405bd66ad"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("""
        UPDATE transactions t
        SET category_uuid = c.category_uuid
        FROM categories c
        WHERE t.category_id = c.id
    """)
    pass


def downgrade() -> None:
    op.execute("""
        UPDATE transactions
        SET category_uuid = NULL
    """)
    pass
