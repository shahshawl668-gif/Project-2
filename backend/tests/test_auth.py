from fastapi.testclient import TestClient


def test_register_and_login(client: TestClient) -> None:
    register_response = client.post(
        "/api/auth/register",
        json={"email": "user@example.com", "password": "supersecret123"},
    )

    assert register_response.status_code == 201
    assert register_response.json()["email"] == "user@example.com"

    login_response = client.post(
        "/api/auth/login",
        json={"email": "user@example.com", "password": "supersecret123"},
    )
    assert login_response.status_code == 200
    assert login_response.json()["token_type"] == "bearer"


def test_login_rejects_invalid_credentials(client: TestClient) -> None:
    response = client.post(
        "/api/auth/login",
        json={"email": "missing@example.com", "password": "supersecret123"},
    )
    assert response.status_code == 401
