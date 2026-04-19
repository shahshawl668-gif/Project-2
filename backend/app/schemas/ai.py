from pydantic import BaseModel, Field


class MatchRequest(BaseModel):
    job_description: str = Field(min_length=20)
    resume_text: str = Field(min_length=20)


class MatchResponse(BaseModel):
    match_score: int = Field(ge=0, le=100)
    matched_keywords: list[str]
    missing_keywords: list[str]
    improvement_suggestions: list[str]
