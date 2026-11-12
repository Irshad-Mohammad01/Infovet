"""create software company tables for INFOVATE

Revision ID: 0004_create_software_company_tables
Revises: 0003_create_platform_settings
Create Date: 2026-11-11 22:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0004_company_tables'
down_revision: Union[str, None] = '0003_create_platform_settings'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Company Profile
    op.create_table(
        'company_profile',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('company_name', sa.String(length=120), server_default='INFOVATE', nullable=False),
        sa.Column('tagline', sa.String(length=255), server_default='We Build Digital Solutions That Move Businesses Forward.', nullable=False),
        sa.Column('short_description', sa.Text(), nullable=False),
        sa.Column('about_markdown', sa.Text(), nullable=False),
        sa.Column('mission', sa.Text(), nullable=False),
        sa.Column('vision', sa.Text(), nullable=False),
        sa.Column('experience_years', sa.Integer(), server_default='5', nullable=False),
        sa.Column('projects_completed', sa.Integer(), server_default='45', nullable=False),
        sa.Column('satisfied_clients', sa.Integer(), server_default='38', nullable=False),
        sa.Column('primary_email', sa.String(length=120), server_default='contact@infovate.in', nullable=False),
        sa.Column('phone', sa.String(length=50), server_default='+91 98765 43210', nullable=False),
        sa.Column('address', sa.String(length=255), server_default='Bengaluru, Karnataka, India', nullable=False),
        sa.Column('linkedin_url', sa.String(length=255), nullable=True),
        sa.Column('github_url', sa.String(length=255), nullable=True),
        sa.Column('twitter_url', sa.String(length=255), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    # 2. Services
    op.create_table(
        'services',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=150), nullable=False),
        sa.Column('slug', sa.String(length=150), nullable=False),
        sa.Column('icon', sa.String(length=80), server_default='Code', nullable=False),
        sa.Column('short_description', sa.Text(), nullable=False),
        sa.Column('full_description', sa.Text(), nullable=False),
        sa.Column('features', sa.JSON(), nullable=False),
        sa.Column('technologies', sa.JSON(), nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_services_slug'), 'services', ['slug'], unique=True)
    op.create_index(op.f('ix_services_is_active'), 'services', ['is_active'], unique=False)

    # 3. Technologies
    op.create_table(
        'technologies',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=50), server_default='Backend', nullable=False),
        sa.Column('icon', sa.String(length=100), server_default='Code', nullable=False),
        sa.Column('description', sa.Text(), server_default='', nullable=False),
        sa.Column('is_featured', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_technologies_slug'), 'technologies', ['slug'], unique=True)
    op.create_index(op.f('ix_technologies_category'), 'technologies', ['category'], unique=False)
    op.create_index(op.f('ix_technologies_is_featured'), 'technologies', ['is_featured'], unique=False)

    # 4. Projects
    op.create_table(
        'projects',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=False),
        sa.Column('category', sa.String(length=100), server_default='Web Application', nullable=False),
        sa.Column('client_name', sa.String(length=150), nullable=True),
        sa.Column('short_description', sa.Text(), nullable=False),
        sa.Column('full_description', sa.Text(), nullable=False),
        sa.Column('objectives', sa.Text(), nullable=True),
        sa.Column('features', sa.JSON(), nullable=False),
        sa.Column('technologies', sa.JSON(), nullable=False),
        sa.Column('thumbnail_url', sa.String(length=500), nullable=True),
        sa.Column('live_url', sa.String(length=500), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('start_date', sa.Date(), nullable=True),
        sa.Column('completion_date', sa.Date(), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='Completed', nullable=False),
        sa.Column('is_featured', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('is_published', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_projects_slug'), 'projects', ['slug'], unique=True)
    op.create_index(op.f('ix_projects_category'), 'projects', ['category'], unique=False)
    op.create_index(op.f('ix_projects_is_featured'), 'projects', ['is_featured'], unique=False)
    op.create_index(op.f('ix_projects_is_published'), 'projects', ['is_published'], unique=False)

    # 5. Project Images
    op.create_table(
        'project_images',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('project_id', sa.Integer(), nullable=False),
        sa.Column('image_url', sa.String(length=500), nullable=False),
        sa.Column('caption', sa.String(length=255), nullable=True),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_project_images_project_id'), 'project_images', ['project_id'], unique=False)

    # 6. Testimonials
    op.create_table(
        'testimonials',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('client_name', sa.String(length=150), nullable=False),
        sa.Column('client_company', sa.String(length=150), nullable=False),
        sa.Column('client_role', sa.String(length=100), server_default='Founder / CEO', nullable=False),
        sa.Column('client_avatar_url', sa.String(length=500), nullable=True),
        sa.Column('rating', sa.Integer(), server_default='5', nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('project_title', sa.String(length=150), nullable=True),
        sa.Column('is_featured', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_testimonials_is_featured'), 'testimonials', ['is_featured'], unique=False)

    # 7. Team Members
    op.create_table(
        'team_members',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('role', sa.String(length=120), nullable=False),
        sa.Column('bio', sa.Text(), server_default='', nullable=False),
        sa.Column('photo_url', sa.String(length=500), nullable=True),
        sa.Column('linkedin_url', sa.String(length=500), nullable=True),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('twitter_url', sa.String(length=500), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('display_order', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_team_members_is_active'), 'team_members', ['is_active'], unique=False)

    # 8. Project Inquiries
    op.create_table(
        'project_inquiries',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('full_name', sa.String(length=150), nullable=False),
        sa.Column('email', sa.String(length=150), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=True),
        sa.Column('company_name', sa.String(length=150), nullable=True),
        sa.Column('project_type', sa.String(length=100), server_default='Custom Web Application', nullable=False),
        sa.Column('estimated_budget', sa.String(length=100), nullable=True),
        sa.Column('expected_timeline', sa.String(length=100), nullable=True),
        sa.Column('project_description', sa.Text(), nullable=False),
        sa.Column('attachment_url', sa.String(length=500), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='New', nullable=False),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_project_inquiries_email'), 'project_inquiries', ['email'], unique=False)
    op.create_index(op.f('ix_project_inquiries_status'), 'project_inquiries', ['status'], unique=False)

    # 9. Media Assets
    op.create_table(
        'media_assets',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('filename', sa.String(length=255), nullable=False),
        sa.Column('original_name', sa.String(length=255), nullable=False),
        sa.Column('file_url', sa.String(length=500), nullable=False),
        sa.Column('file_type', sa.String(length=80), nullable=False),
        sa.Column('file_size', sa.Integer(), server_default='0', nullable=False),
        sa.Column('category', sa.String(length=50), server_default='general', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_media_assets_category'), 'media_assets', ['category'], unique=False)


def downgrade() -> None:
    op.drop_table('media_assets')
    op.drop_table('project_inquiries')
    op.drop_table('team_members')
    op.drop_table('testimonials')
    op.drop_table('project_images')
    op.drop_table('projects')
    op.drop_table('technologies')
    op.drop_table('services')
    op.drop_table('company_profile')
