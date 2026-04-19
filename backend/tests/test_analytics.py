from fastapi.testclient import TestClient


def test_analytics_returns_rates_and_insights(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    applications = [
        {
            "company_name": "Acme",
            "role": "Backend Engineer",
            "job_link": "https://example.com/jobs/1",
            "job_description": "Python FastAPI SQL PostgreSQL",
            "resume_text": "Python SQL",
            "applied_date": "2026-04-01",
            "status": "REJECTED",
            "match_score": 40,
        },
        {
            "company_name": "Beta",
            "role": "Platform Engineer",
            "job_link": "https://example.com/jobs/2",
            "job_description": "Python Terraform AWS APIs",
            "resume_text": "Python APIs",
            "applied_date": "2026-04-05",
            "status": "INTERVIEW",
            "match_score": 52,
        },
    ]
    for payload in applications:
        response = client.post("/api/applications", headers=auth_headers, json=payload)
        assert response.status_code == 201

    analytics_response = client.get("/api/analytics", headers=auth_headers)
    assert analytics_response.status_code == 200

    body = analytics_response.json()
    assert body["total_applications"] == 2
    assert body["interview_rate"] == 50.0
    assert body["rejection_rate"] == 50.0
    assert body["average_match_score"] == 46.0
    assert body["weekly_trend"]
    assert body["insights"]
