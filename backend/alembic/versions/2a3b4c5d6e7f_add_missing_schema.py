"""Add missing schema columns and tables

Revision ID: 2a3b4c5d6e7f
Revises: 1f3e23fa39d3
Create Date: 2026-09-25 12:15:00
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from app.database import Base
import app.models  # ensure all models are registered

revision: str = '2a3b4c5d6e7f'
down_revision: Union[str, None] = '1f3e23fa39d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add missing columns to users & tutor_profiles
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS birthday VARCHAR(50);")
    op.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT;")
    op.execute("ALTER TABLE tutor_profiles ADD COLUMN IF NOT EXISTS rejection_reason TEXT;")

    # 2. Create any remaining missing tables (materials, lesson_sessions, progress_reports, assignments, etc.)
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)


def downgrade() -> None:
    pass
