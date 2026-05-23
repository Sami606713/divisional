"""add teacher_id to subjects

Revision ID: 6f1a2e9c4d21
Revises: db676c5d4aac
Create Date: 2026-05-24 00:00:00.000000
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6f1a2e9c4d21"
down_revision: Union[str, Sequence[str], None] = "db676c5d4aac"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("subjects", sa.Column("teacher_id", sa.String(), nullable=True))
    op.create_foreign_key(
        "fk_subjects_teacher_id_teachers",
        "subjects",
        "teachers",
        ["teacher_id"],
        ["id"],
    )


def downgrade() -> None:
    op.drop_constraint("fk_subjects_teacher_id_teachers", "subjects", type_="foreignkey")
    op.drop_column("subjects", "teacher_id")
