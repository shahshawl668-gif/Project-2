from fastapi.testclient import TestClient


def test_create_list_update_and_delete_application(
    client: TestClient, auth_headers: dict[str, str]
) -> None:
    create_response = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company_name": "Acme",
            "role": "Backend Engineer",
            "job_link": "https://example.com/jobs/1",
            "job_description": "Python FastAPI SQLAlchemy PostgreSQL APIs",
            "resume_text": "Built Python APIs with FastAPI and PostgreSQL",
            "applied_date": "2026-04-01",
            "status": "APPLIED",
            "match_score": 82,
        },
    )
    assert create_response.status_code == 201
    created = create_response.json()

    list_response = client.get("/api/applications", headers=auth_headers)
    assert list_response.status_code == 200
    assert len(list_response.json()) == 1

    update_response = client.put(
        f"/api/applications/{created['id']}",
        headers=auth_headers,
        json={"status": "INTERVIEW"},
    )
    assert update_response.status_code == 200
    assert update_response.json()["status"] == "INTERVIEW"

    delete_response = client.delete(
        f"/api/applications/{created['id']}",
        headers=auth_headers,
    )
    assert delete_response.status_code == 204

    final_list = client.get("/api/applications", headers=auth_headers)
    assert final_list.json() == []
