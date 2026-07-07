"""switch PKs and FKs to UUID

Revision ID: 768c3c2f3466
Revises: e9fbfb76ec75
Create Date: 2026-04-07 14:18:06.148517

"""

from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "768c3c2f3466"
down_revision: Union[str, Sequence[str], None] = "e9fbfb76ec75"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
