from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

from app.models.application import ApplicationStatus


class ApplicationBase(BaseModel):
    company_name: str = Field(min_length=1, max_length=255)
    role: str = Field(min_length=1, max_length=255)
    job_link: HttpUrl | None = None
    job_description: str | None = None
    resume_text: str | None = None
    applied_date: date
    interview_date: datetime | None = None
    status: ApplicationStatus = ApplicationStatus.APPLIED
    match_score: int | None = Field(default=None, ge=0, le=100)


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    company_name: str | None = Field(default=None, min_length=1, max_length=255)
    role: str | None = Field(default=None, min_length=1, max_length=255)
    job_link: HttpUrl | None = None
    job_description: str | None = None
    resume_text: str | None = None
    applied_date: date | None = None
    interview_date: datetime | None = None
    status: ApplicationStatus | None = None
    match_score: int | None = Field(default=None, ge=0, le=100)


class ReminderInfo(BaseModel):
    needs_follow_up: bool
    follow_up_date: date
    needs_interview_reminder: bool


class ApplicationResponse(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    created_at: datetime
    reminders: ReminderInfo
