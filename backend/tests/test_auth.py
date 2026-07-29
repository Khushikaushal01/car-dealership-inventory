from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_register_user():
    response = client.post(
        "/api/auth/register"
    )

    assert response.status_code == 200