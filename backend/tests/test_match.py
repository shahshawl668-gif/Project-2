from app.services.match_engine import analyze_match


def test_analyze_match_scores_keyword_overlap() -> None:
    result = analyze_match(
        "We need Python, FastAPI, PostgreSQL, Docker, and AWS experience.",
        "Backend engineer with Python, FastAPI, and Docker project experience.",
    )

    assert result.match_score > 0
    assert "postgresql" in result.missing_keywords
    assert len(result.improvement_suggestions) >= 1
