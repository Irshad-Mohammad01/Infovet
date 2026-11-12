"""add inquiry fields and support general inquiries

Revision ID: 0005_inquiry_fields
Revises: 0004_company_tables
Create Date: 2026-11-11 23:30:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0005_inquiry_fields'
down_revision = '0004_company_tables'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('project_inquiries', sa.Column('inquiry_type', sa.String(length=50), server_default='project', nullable=False))
    op.create_index(op.f('ix_project_inquiries_inquiry_type'), 'project_inquiries', ['inquiry_type'], unique=False)
    op.add_column('project_inquiries', sa.Column('company', sa.String(length=150), nullable=True))
    op.add_column('project_inquiries', sa.Column('timeline', sa.String(length=100), nullable=True))
    op.add_column('project_inquiries', sa.Column('subject', sa.String(length=255), nullable=True))
    op.add_column('project_inquiries', sa.Column('message', sa.Text(), nullable=True))
    op.alter_column('project_inquiries', 'project_description', existing_type=sa.Text(), nullable=True)
    op.alter_column('project_inquiries', 'project_type', existing_type=sa.String(length=100), nullable=True)
    op.alter_column('project_inquiries', 'status', existing_type=sa.String(length=50), server_default='NEW', nullable=False)


def downgrade() -> None:
    op.alter_column('project_inquiries', 'status', existing_type=sa.String(length=50), server_default='New', nullable=False)
    op.alter_column('project_inquiries', 'project_type', existing_type=sa.String(length=100), nullable=False)
    op.alter_column('project_inquiries', 'project_description', existing_type=sa.Text(), nullable=False)
    op.drop_column('project_inquiries', 'message')
    op.drop_column('project_inquiries', 'subject')
    op.drop_column('project_inquiries', 'timeline')
    op.drop_column('project_inquiries', 'company')
    op.drop_index(op.f('ix_project_inquiries_inquiry_type'), table_name='project_inquiries')
    op.drop_column('project_inquiries', 'inquiry_type')
