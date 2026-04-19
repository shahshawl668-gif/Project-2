from app.schemas.analytics import InsightItem


def build_insights(
    *,
    total_applications: int,
    interview_rate: float,
    rejection_rate: float,
    average_match_score: float,
) -> list[InsightItem]:
    if total_applications == 0:
        return [
            InsightItem(
                title="No applications yet",
                severity="info",
                message="Add your first application to start tracking pipeline performance.",
            )
        ]

    insights: list[InsightItem] = []

    if interview_rate < 5:
        insights.append(
            InsightItem(
                title="Low response rate detected",
                severity="high",
                message="Your resume may not be optimized for the roles you are targeting.",
            )
        )

    if rejection_rate > 70:
        insights.append(
            InsightItem(
                title="High rejection rate",
                severity="high",
                message="You may be applying to roles that are not closely aligned with your profile.",
            )
        )

    if average_match_score < 55:
        insights.append(
            InsightItem(
                title="Resume lacks required keywords",
                severity="medium",
                message="Prioritize role-specific skills and tools from each job description in your resume.",
            )
        )

    if not insights:
        insights.append(
            InsightItem(
                title="Pipeline looks healthy",
                severity="info",
                message="Your conversion metrics are stable. Keep refining applications with the highest match scores.",
            )
        )

    return insights
