from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.rate_limit import limiter
from app.schemas.auth import TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import authenticate_user, register_user

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
@limiter.limit("10/minute")
def register(
    request: Request,
    payload: UserCreate,
    db: Session = Depends(get_db),
) -> UserResponse:
    user = register_user(db, payload)
    return UserResponse.model_validate(user)


@router.post("/login", response_model=TokenResponse)
@limiter.limit("20/minute")
def login(
    request: Request,
    payload: UserLogin,
    db: Session = Depends(get_db),
) -> TokenResponse:
    token = authenticate_user(db, payload)
    return TokenResponse(access_token=token)
