from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.analytics import AnalyticsResponse
from app.services.analytics_service import get_analytics

router = APIRouter()


@router.get("/analytics", response_model=AnalyticsResponse)
def analytics_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalyticsResponse:
    return get_analytics(db, current_user)
