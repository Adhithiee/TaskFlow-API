"""add due_date column to task_table

Revision ID: 2fe12e8549da
Revises: 
Create Date: 2026-04-13 11:15:53.671655

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2fe12e8549da'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "task_table",
        sa.Column("due_date",sa.Date,nullable=True)
    )
    pass


def downgrade() -> None:
    op.drop_column("task_table","due_date")
    pass
