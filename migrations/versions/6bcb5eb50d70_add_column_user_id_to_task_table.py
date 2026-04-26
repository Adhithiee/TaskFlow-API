"""Add column user_id to task_table

Revision ID: 6bcb5eb50d70
Revises: d3c6686ab443
Create Date: 2026-04-16 20:11:06.217098

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '6bcb5eb50d70'
down_revision: Union[str, Sequence[str], None] = 'd3c6686ab443'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        'task_table',
        sa.Column('user_id', sa.Integer(), sa.ForeignKey('user_table.id', ondelete="CASCADE")
                  )
    )
    pass


def downgrade() -> None:
    op.drop_column('task_table', 'user_id')
    pass
