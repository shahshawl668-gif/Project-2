from pydantic import BaseModel


class TrendPoint(BaseModel):
    week_start: str
    count: int


class InsightItem(BaseModel):
    title: str
    severity: str
    message: str


class AnalyticsResponse(BaseModel):
    total_applications: int
    interview_rate: float
    offer_rate: float
    rejection_rate: float
    average_match_score: float
    weekly_trend: list[TrendPoint]
    insights: list[InsightItem]
