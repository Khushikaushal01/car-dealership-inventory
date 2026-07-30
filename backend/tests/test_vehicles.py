from fastapi.testclient import TestClient
from main import app
from app.database import SessionLocal
from app.models.user import User

client = TestClient(app)


def test_create_vehicle_unauthorized():
    # Make a post without authentication header
    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 5
    }
    response = client.post("/api/vehicles", json=payload)
    assert response.status_code == 401


def test_create_vehicle_authorized():
    # Create test user and login to get JWT
    db = SessionLocal()
    # Ensure test user exists
    user = db.query(User).filter(User.email == "test_vehicle_user@example.com").first()
    if not user:
        client.post("/api/auth/register", json={
            "username": "testvehicleuser",
            "email": "test_vehicle_user@example.com",
            "password": "password123"
        })
    db.close()

    # Login to get token
    login_response = client.post("/api/auth/login", json={
        "email": "test_vehicle_user@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 5
    }

    response = client.post("/api/vehicles", json=payload, headers=headers)
    assert response.status_code == 200 or response.status_code == 210  # Wait, let's assert 200 or 201
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["price"] == 25000.0
    assert data["quantity"] == 5
    assert "id" in data
