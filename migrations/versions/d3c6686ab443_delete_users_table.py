"""Delete users_table

Revision ID: d3c6686ab443
Revises: 2fe12e8549da
Create Date: 2026-04-15 20:24:11.719190

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd3c6686ab443'
down_revision: Union[str, Sequence[str], None] = '2fe12e8549da'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("user_table")
    pass


def downgrade() -> None:
    op.create_table(
        "user_table",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(), nullable=True),
        sa.Column("username", sa.String(), nullable=True),
        sa.Column("password", sa.String(), nullable=True),
        sa.Column("email", sa.String(), nullable=True),
    )
    pass
