from collections import defaultdict
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application, ApplicationStatus
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse, TrendPoint
from app.services.insights_engine import build_insights


def _rate(count: int, total: int) -> float:
    return round((count / total) * 100, 2) if total else 0.0


def get_analytics(db: Session, current_user: User) -> AnalyticsResponse:
    applications = db.scalars(
        select(Application).where(Application.user_id == current_user.id)
    ).all()
    total = len(applications)
    interview_count = sum(1 for item in applications if item.status == ApplicationStatus.INTERVIEW)
    offer_count = sum(1 for item in applications if item.status == ApplicationStatus.OFFER)
    rejection_count = sum(1 for item in applications if item.status == ApplicationStatus.REJECTED)
    scored = [item.match_score for item in applications if item.match_score is not None]
    average_match_score = round(sum(scored) / len(scored), 2) if scored else 0.0

    grouped_weeks: dict[str, int] = defaultdict(int)
    for application in applications:
        week_start = application.applied_date - timedelta(days=application.applied_date.weekday())
        grouped_weeks[week_start.isoformat()] += 1

    weekly_trend = [
        TrendPoint(week_start=week_start, count=count)
        for week_start, count in sorted(grouped_weeks.items())
    ]

    interview_rate = _rate(interview_count, total)
    rejection_rate = _rate(rejection_count, total)
    offer_rate = _rate(offer_count, total)

    return AnalyticsResponse(
        total_applications=total,
        interview_rate=interview_rate,
        offer_rate=offer_rate,
        rejection_rate=rejection_rate,
        average_match_score=average_match_score,
        weekly_trend=weekly_trend,
        insights=build_insights(
            total_applications=total,
            interview_rate=interview_rate,
            rejection_rate=rejection_rate,
            average_match_score=average_match_score,
        ),
    )
