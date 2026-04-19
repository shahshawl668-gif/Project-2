from fastapi import APIRouter, Depends, Response, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.services.application_service import (
    create_application,
    delete_application,
    list_applications,
    update_application,
)

router = APIRouter()


@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application_endpoint(
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ApplicationResponse:
    return create_application(db, current_user, payload)


@router.get("", response_model=list[ApplicationResponse])
def list_applications_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[ApplicationResponse]:
    return list_applications(db, current_user)


@router.put("/{application_id}", response_model=ApplicationResponse)
def update_application_endpoint(
    application_id: str,
    payload: ApplicationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> ApplicationResponse:
    return update_application(db, application_id, current_user, payload)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application_endpoint(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Response:
    delete_application(db, application_id, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
