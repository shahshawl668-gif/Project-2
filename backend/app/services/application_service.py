from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.user import User
from app.schemas.application import ApplicationCreate, ApplicationResponse, ApplicationUpdate
from app.services.reminders import build_reminder_info


def _to_response(application: Application) -> ApplicationResponse:
    return ApplicationResponse.model_validate(
        {
            **application.__dict__,
            "reminders": build_reminder_info(application),
        }
    )


def create_application(
    db: Session,
    current_user: User,
    payload: ApplicationCreate,
) -> ApplicationResponse:
    payload_data = payload.model_dump()
    if payload_data.get("job_link") is not None:
        payload_data["job_link"] = str(payload_data["job_link"])

    application = Application(user_id=current_user.id, **payload_data)
    db.add(application)
    db.commit()
    db.refresh(application)
    return _to_response(application)


def list_applications(db: Session, current_user: User) -> list[ApplicationResponse]:
    applications = db.scalars(
        select(Application)
        .where(Application.user_id == current_user.id)
        .order_by(Application.applied_date.desc(), Application.created_at.desc())
    ).all()
    return [_to_response(application) for application in applications]


def get_application_or_404(db: Session, application_id: str, user_id: str) -> Application:
    application = db.scalar(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == user_id,
        )
    )
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )
    return application


def update_application(
    db: Session,
    application_id: str,
    current_user: User,
    payload: ApplicationUpdate,
) -> ApplicationResponse:
    application = get_application_or_404(db, application_id, current_user.id)
    update_data = payload.model_dump(exclude_unset=True)
    if update_data.get("job_link") is not None:
        update_data["job_link"] = str(update_data["job_link"])

    for field, value in update_data.items():
        setattr(application, field, value)
    db.add(application)
    db.commit()
    db.refresh(application)
    return _to_response(application)


def delete_application(db: Session, application_id: str, current_user: User) -> None:
    application = get_application_or_404(db, application_id, current_user.id)
    db.delete(application)
    db.commit()
