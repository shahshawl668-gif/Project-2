from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.ai import MatchRequest, MatchResponse
from app.services.match_engine import analyze_match

router = APIRouter()


@router.post("/match", response_model=MatchResponse)
def analyze_match_endpoint(
    payload: MatchRequest,
    current_user: User = Depends(get_current_user),
) -> MatchResponse:
    del current_user
    return analyze_match(payload.job_description, payload.resume_text)
