"""create platform settings table

Revision ID: 0003_create_platform_settings
Revises: 0002_create_infovet_tables
Create Date: 2026-11-10 21:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0003_create_platform_settings'
down_revision: Union[str, None] = '0002_create_infovet_tables'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'platform_settings',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('platform_name', sa.String(length=120), nullable=False, server_default='Infovate'),
        sa.Column('platform_logo_url', sa.String(length=500), nullable=True),
        sa.Column('favicon_url', sa.String(length=500), nullable=True),
        sa.Column('tagline', sa.String(length=255), nullable=True, server_default='Enterprise Software & IT Solutions'),
        sa.Column('primary_color', sa.String(length=30), nullable=True, server_default='#6025C5'),
        sa.Column('secondary_color', sa.String(length=30), nullable=True, server_default='#F8F7FC'),
        sa.Column('background_color', sa.String(length=30), nullable=True, server_default='#F8F7FC'),
        sa.Column('support_email', sa.String(length=255), nullable=True, server_default='support@infovate.io'),
        sa.Column('contact_phone', sa.String(length=50), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_by', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('id'),
    )


def downgrade() -> None:
    op.drop_table('platform_settings')

