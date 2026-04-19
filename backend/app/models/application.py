import uuid
from datetime import date, datetime
from enum import Enum

from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class ApplicationStatus(str, Enum):
    APPLIED = "APPLIED"
    SCREENING = "SCREENING"
    INTERVIEW = "INTERVIEW"
    OFFER = "OFFER"
    REJECTED = "REJECTED"


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    user_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    company_name: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(255))
    job_link: Mapped[str | None] = mapped_column(String(2048), nullable=True)
    job_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    resume_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    applied_date: Mapped[date] = mapped_column(Date, nullable=False)
    interview_date: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        SqlEnum(ApplicationStatus, name="application_status", native_enum=False),
        default=ApplicationStatus.APPLIED,
    )
    match_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user = relationship("User", back_populates="applications")
