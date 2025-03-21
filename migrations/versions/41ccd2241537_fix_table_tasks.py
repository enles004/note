"""fix table tasks

Revision ID: 41ccd2241537
Revises: a472ee43dadc
Create Date: 2025-01-02 02:47:35.917645

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '41ccd2241537'
down_revision: Union[str, None] = 'a472ee43dadc'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tasks', sa.Column('reminder', sa.DateTime(timezone=True), nullable=True))
    op.add_column('tasks', sa.Column('repeat', sa.String(length=255), nullable=True))
    op.add_column('tasks', sa.Column('color', sa.String(length=255), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tasks', 'color')
    op.drop_column('tasks', 'repeat')
    op.drop_column('tasks', 'reminder')
    # ### end Alembic commands ###
