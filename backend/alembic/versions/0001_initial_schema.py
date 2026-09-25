"""Create Sprint 1 catalog and tutor schema.

Revision ID: 0001
Revises:
Create Date: 2026-09-24
"""

from typing import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(30)),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False, server_default=""),
        sa.Column("role", sa.String(20), nullable=False, server_default="parent"),
        sa.Column("avatar_url", sa.String(500)),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.UniqueConstraint("email", name="uq_users_email"),
    )
    op.create_index("ix_users_email", "users", ["email"])
    op.create_index("ix_users_role", "users", ["role"])

    op.create_table(
        "subjects",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("icon", sa.String(20)),
        sa.Column("color", sa.String(20)),
        sa.UniqueConstraint("slug", name="uq_subjects_slug"),
        sa.UniqueConstraint("name", name="uq_subjects_name"),
    )
    op.create_index("ix_subjects_slug", "subjects", ["slug"])

    op.create_table(
        "levels",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(100), nullable=False),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("grades", sa.String(120)),
        sa.UniqueConstraint("slug", name="uq_levels_slug"),
        sa.UniqueConstraint("name", name="uq_levels_name"),
    )
    op.create_index("ix_levels_slug", "levels", ["slug"])

    op.create_table(
        "locations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("slug", sa.String(160), nullable=False),
        sa.Column("city", sa.String(120), nullable=False),
        sa.Column("district", sa.String(120), nullable=False),
        sa.UniqueConstraint("slug", name="uq_locations_slug"),
    )
    op.create_index("ix_locations_slug", "locations", ["slug"])
    op.create_index("ix_locations_city", "locations", ["city"])
    op.create_index("ix_locations_district", "locations", ["district"])

    op.create_table(
        "tutor_profiles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "location_id",
            sa.Integer(),
            sa.ForeignKey("locations.id", ondelete="SET NULL"),
        ),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("bio", sa.Text(), nullable=False),
        sa.Column("experience_years", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("price_per_hour", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("teaching_mode", sa.String(20), nullable=False, server_default="online"),
        sa.Column("verified", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("status", sa.String(20), nullable=False, server_default="draft"),
        sa.Column("rating", sa.Float(), nullable=False, server_default="0"),
        sa.Column("review_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("completed_lessons", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("student_count", sa.Integer(), nullable=False, server_default="0"),
        sa.CheckConstraint(
            "teaching_mode IN ('online', 'offline', 'both')",
            name="ck_tutor_profiles_teaching_mode",
        ),
        sa.CheckConstraint(
            "status IN ('draft', 'pending', 'approved', 'rejected')",
            name="ck_tutor_profiles_status",
        ),
        sa.UniqueConstraint("user_id", name="uq_tutor_profiles_user_id"),
    )
    op.create_index("ix_tutor_profiles_user_id", "tutor_profiles", ["user_id"])
    op.create_index("ix_tutor_profiles_location_id", "tutor_profiles", ["location_id"])
    op.create_index("ix_tutor_profiles_verified", "tutor_profiles", ["verified"])
    op.create_index("ix_tutor_profiles_status", "tutor_profiles", ["status"])

    op.create_table(
        "tutor_subjects",
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "subject_id",
            sa.Integer(),
            sa.ForeignKey("subjects.id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_table(
        "tutor_levels",
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            primary_key=True,
        ),
        sa.Column(
            "level_id",
            sa.Integer(),
            sa.ForeignKey("levels.id", ondelete="CASCADE"),
            primary_key=True,
        ),
    )
    op.create_table(
        "tutor_educations",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("degree", sa.String(120), nullable=False),
        sa.Column("major", sa.String(255), nullable=False),
        sa.Column("school", sa.String(255), nullable=False),
        sa.Column("year", sa.Integer()),
    )
    op.create_index(
        "ix_tutor_educations_tutor_profile_id",
        "tutor_educations",
        ["tutor_profile_id"],
    )
    op.create_table(
        "tutor_certificates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("file_url", sa.String(500)),
    )
    op.create_index(
        "ix_tutor_certificates_tutor_profile_id",
        "tutor_certificates",
        ["tutor_profile_id"],
    )
    op.create_table(
        "tutor_availabilities",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("day_of_week", sa.String(10), nullable=False),
        sa.Column("start_time", sa.Time(), nullable=False),
        sa.Column("end_time", sa.Time(), nullable=False),
        sa.UniqueConstraint(
            "tutor_profile_id",
            "day_of_week",
            "start_time",
            "end_time",
            name="uq_tutor_availability_slot",
        ),
    )
    op.create_index(
        "ix_tutor_availabilities_tutor_profile_id",
        "tutor_availabilities",
        ["tutor_profile_id"],
    )
    op.create_table(
        "reviews",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "tutor_profile_id",
            sa.Integer(),
            sa.ForeignKey("tutor_profiles.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="SET NULL"),
        ),
        sa.Column("booking_id", sa.Integer()),
        sa.Column("rating", sa.Integer(), nullable=False),
        sa.Column("comment", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.func.now(),
        ),
        sa.CheckConstraint("rating BETWEEN 1 AND 5", name="ck_reviews_rating"),
    )
    op.create_index("ix_reviews_tutor_profile_id", "reviews", ["tutor_profile_id"])
    op.create_index("ix_reviews_user_id", "reviews", ["user_id"])
    op.create_index("ix_reviews_booking_id", "reviews", ["booking_id"])
    op.create_index("ix_reviews_created_at", "reviews", ["created_at"])


def downgrade() -> None:
    op.drop_table("reviews")
    op.drop_table("tutor_availabilities")
    op.drop_table("tutor_certificates")
    op.drop_table("tutor_educations")
    op.drop_table("tutor_levels")
    op.drop_table("tutor_subjects")
    op.drop_table("tutor_profiles")
    op.drop_table("locations")
    op.drop_table("levels")
    op.drop_table("subjects")
    op.drop_table("users")
