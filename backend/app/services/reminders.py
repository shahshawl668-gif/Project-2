from datetime import UTC, date, datetime, timedelta

from app.models.application import Application, ApplicationStatus
from app.schemas.application import ReminderInfo


FOLLOW_UP_AFTER_DAYS = 5


def build_reminder_info(application: Application) -> ReminderInfo:
    follow_up_date = application.applied_date + timedelta(days=FOLLOW_UP_AFTER_DAYS)
    needs_follow_up = (
        application.status in {ApplicationStatus.APPLIED, ApplicationStatus.SCREENING}
        and date.today() >= follow_up_date
    )
    needs_interview_reminder = bool(
        application.interview_date
        and application.interview_date >= datetime.now(UTC)
        and application.interview_date <= datetime.now(UTC) + timedelta(days=1)
    )
    return ReminderInfo(
        needs_follow_up=needs_follow_up,
        follow_up_date=follow_up_date,
        needs_interview_reminder=needs_interview_reminder,
    )
