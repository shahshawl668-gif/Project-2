"""Initial schema for JobTracker AI."""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "0001_initial_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    status_enum = sa.Enum(
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        name="application_status",
        native_enum=False,
    )

    op.create_table(
        "users",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("email", sa.String(length=320), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "applications",
        sa.Column("id", sa.String(length=36), primary_key=True),
        sa.Column("user_id", sa.String(length=36), nullable=False),
        sa.Column("company_name", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=255), nullable=False),
        sa.Column("job_link", sa.String(length=2048), nullable=True),
        sa.Column("job_description", sa.Text(), nullable=True),
        sa.Column("resume_text", sa.Text(), nullable=True),
        sa.Column("applied_date", sa.Date(), nullable=False),
        sa.Column("interview_date", sa.DateTime(timezone=True), nullable=True),
        sa.Column("status", status_enum, nullable=False, server_default="APPLIED"),
        sa.Column("match_score", sa.Integer(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
    )
    op.create_index("ix_applications_user_id", "applications", ["user_id"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_applications_user_id", table_name="applications")
    op.drop_table("applications")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
