"""create infovet job portal tables

Revision ID: 0002_create_infovet_tables
Revises: 0001_create_contacts
Create Date: 2026-11-10 20:15:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0002_create_infovet_tables'
down_revision: Union[str, None] = '0001_create_contacts'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=True),
        sa.Column('role', sa.String(length=20), server_default='customer', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('headline', sa.String(length=150), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('location', sa.String(length=120), nullable=True),
        sa.Column('skills', sa.Text(), nullable=True),
        sa.Column('avatar_url', sa.String(length=500), nullable=True),
        sa.Column('resume_url', sa.String(length=500), nullable=True),
        sa.Column('github_url', sa.String(length=255), nullable=True),
        sa.Column('linkedin_url', sa.String(length=255), nullable=True),
        sa.Column('portfolio_url', sa.String(length=255), nullable=True),
        sa.Column('otp_code', sa.String(length=10), nullable=True),
        sa.Column('otp_expires_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_role'), 'users', ['role'], unique=False)

    # 2. categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('icon', sa.String(length=50), server_default='Briefcase', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_categories_name'), 'categories', ['name'], unique=True)
    op.create_index(op.f('ix_categories_slug'), 'categories', ['slug'], unique=True)

    # 3. jobs table
    op.create_table(
        'jobs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=180), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=False),
        sa.Column('company_name', sa.String(length=120), nullable=False),
        sa.Column('company_logo', sa.String(length=500), nullable=True),
        sa.Column('company_website', sa.String(length=255), nullable=True),
        sa.Column('location', sa.String(length=120), server_default='Remote', nullable=False),
        sa.Column('workplace_type', sa.String(length=30), server_default='Remote', nullable=False),
        sa.Column('job_type', sa.String(length=30), server_default='Full-time', nullable=False),
        sa.Column('experience_level', sa.String(length=30), server_default='Mid Level', nullable=False),
        sa.Column('salary_min', sa.Integer(), nullable=True),
        sa.Column('salary_max', sa.Integer(), nullable=True),
        sa.Column('salary_currency', sa.String(length=10), server_default='INR', nullable=False),
        sa.Column('salary_is_negotiable', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('requirements', sa.Text(), nullable=False),
        sa.Column('benefits', sa.Text(), nullable=True),
        sa.Column('tags', sa.String(length=255), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default=sa.true(), nullable=False),
        sa.Column('is_featured', sa.Boolean(), server_default=sa.false(), nullable=False),
        sa.Column('views_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('deadline', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id'], ondelete='SET NULL'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_jobs_title'), 'jobs', ['title'], unique=False)
    op.create_index(op.f('ix_jobs_slug'), 'jobs', ['slug'], unique=True)
    op.create_index(op.f('ix_jobs_company_name'), 'jobs', ['company_name'], unique=False)
    op.create_index(op.f('ix_jobs_workplace_type'), 'jobs', ['workplace_type'], unique=False)
    op.create_index(op.f('ix_jobs_job_type'), 'jobs', ['job_type'], unique=False)
    op.create_index(op.f('ix_jobs_experience_level'), 'jobs', ['experience_level'], unique=False)
    op.create_index(op.f('ix_jobs_category_id'), 'jobs', ['category_id'], unique=False)
    op.create_index(op.f('ix_jobs_is_active'), 'jobs', ['is_active'], unique=False)
    op.create_index(op.f('ix_jobs_is_featured'), 'jobs', ['is_featured'], unique=False)

    # 4. applications table
    op.create_table(
        'applications',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=30), nullable=True),
        sa.Column('resume_url', sa.String(length=500), nullable=False),
        sa.Column('cover_note', sa.Text(), nullable=True),
        sa.Column('portfolio_url', sa.String(length=255), nullable=True),
        sa.Column('linkedin_url', sa.String(length=255), nullable=True),
        sa.Column('status', sa.String(length=30), server_default='pending', nullable=False),
        sa.Column('admin_notes', sa.Text(), nullable=True),
        sa.Column('applied_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('job_id', 'user_id', name='uq_job_user_application'),
    )
    op.create_index(op.f('ix_applications_job_id'), 'applications', ['job_id'], unique=False)
    op.create_index(op.f('ix_applications_user_id'), 'applications', ['user_id'], unique=False)
    op.create_index(op.f('ix_applications_status'), 'applications', ['status'], unique=False)

    # 5. saved_jobs table
    op.create_table(
        'saved_jobs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('job_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['job_id'], ['jobs.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'job_id', name='uq_user_saved_job'),
    )
    op.create_index(op.f('ix_saved_jobs_job_id'), 'saved_jobs', ['job_id'], unique=False)
    op.create_index(op.f('ix_saved_jobs_user_id'), 'saved_jobs', ['user_id'], unique=False)


def downgrade() -> None:
    # Drop in reverse dependency order without touching contacts
    op.drop_table('saved_jobs')
    op.drop_table('applications')
    op.drop_table('jobs')
    op.drop_table('categories')
    op.drop_table('users')

