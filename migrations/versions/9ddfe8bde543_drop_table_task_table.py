"""Drop table task_table

Revision ID: 9ddfe8bde543
Revises: 6bcb5eb50d70
Create Date: 2026-04-16 21:15:08.476856

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9ddfe8bde543'
down_revision: Union[str, Sequence[str], None] = '6bcb5eb50d70'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_table("task_table")
    pass


def downgrade() -> None:
    op.create_table(
        'task_table',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('title', sa.String, nullable=False),
        sa.Column('desc', sa.String, nullable=True),
        sa.Column('status', sa.Enum('pending', 'in_progress', 'completed', name='statusenum'), 
                  nullable=False, default='pending'),
        sa.Column('due_date', sa.Date, nullable=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('user_table.id', ondelete='CASCADE'), nullable=False)
    )
    pass
