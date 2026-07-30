from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)


def test_register_user():
    # Clean database first
    db = SessionLocal()
    db.query(User).filter(User.email == "test@example.com").delete()
    db.commit()
    db.close()

    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "mysecretpassword"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"

    # Verify user is saved with hashed password
    db = SessionLocal()
    user = db.query(User).filter(User.email == "test@example.com").first()
    assert user is not None
    assert user.password != "mysecretpassword"
    assert user.password.startswith("$2b$") or user.password.startswith("$2a$")
    db.close()


def test_login_user():
    # Register user first if not exists
    db = SessionLocal()
    existing = db.query(User).filter(User.email == "test@example.com").first()
    if not existing:
        payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "mysecretpassword"
        }
        client.post("/api/auth/register", json=payload)
    db.close()

    # Test login success
    login_payload = {
        "email": "test@example.com",
        "password": "mysecretpassword"
    }
    response = client.post("/api/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

    # Test login failure
    wrong_payload = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }
    response = client.post("/api/auth/login", json=wrong_payload)
    assert response.status_code == 400