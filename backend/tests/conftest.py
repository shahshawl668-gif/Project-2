import sys
from collections.abc import Generator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.core.database import get_db
from app.main import app
from app.models import Base


SQLALCHEMY_DATABASE_URL = "sqlite:///./test_jobtracker.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    future=True,
)
TestingSessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


@pytest.fixture(autouse=True)
def reset_database() -> Generator[None, None, None]:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session() -> Generator[Session, None, None]:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers(client: TestClient) -> dict[str, str]:
    register_response = client.post(
        "/api/auth/register",
        json={"email": "candidate@example.com", "password": "supersecret123"},
    )
    assert register_response.status_code == 201

    login_response = client.post(
        "/api/auth/login",
        json={"email": "candidate@example.com", "password": "supersecret123"},
    )
    token = login_response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
