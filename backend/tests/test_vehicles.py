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
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["price"] == 25000.0
    assert data["quantity"] == 5
    assert "id" in data


def test_purchase_vehicle():
    # Login to get token
    login_response = client.post("/api/auth/login", json={
        "email": "test_vehicle_user@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create a vehicle to purchase
    create_response = client.post("/api/vehicles", json={
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 22000.0,
        "quantity": 10
    }, headers=headers)
    assert create_response.status_code == 201
    vehicle_id = create_response.json()["id"]

    # Purchase the vehicle
    purchase_response = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=headers)
    assert purchase_response.status_code == 200
    assert purchase_response.json()["quantity"] == 9


def test_restock_vehicle():
    # Register an admin user if not exists
    db = SessionLocal()
    admin = db.query(User).filter(User.email == "admin_inventory@example.com").first()
    if not admin:
        client.post("/api/auth/register", json={
            "username": "admininventory",
            "email": "admin_inventory@example.com",
            "password": "adminpassword",
            "is_admin": True
        })
    db.close()

    # Login as admin
    login_response = client.post("/api/auth/login", json={
        "email": "admin_inventory@example.com",
        "password": "adminpassword"
    })
    admin_token = login_response.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Login as regular user
    user_login = client.post("/api/auth/login", json={
        "email": "test_vehicle_user@example.com",
        "password": "password123"
    })
    user_token = user_login.json()["access_token"]
    user_headers = {"Authorization": f"Bearer {user_token}"}

    # Create a vehicle to restock
    create_response = client.post("/api/vehicles", json={
        "make": "Ford",
        "model": "F-150",
        "category": "Truck",
        "price": 45000.0,
        "quantity": 2
    }, headers=user_headers)
    assert create_response.status_code == 201
    vehicle_id = create_response.json()["id"]

    # Try to restock as regular user (should fail with 403)
    restock_user_res = client.post(f"/api/vehicles/{vehicle_id}/restock?qty=5", headers=user_headers)
    assert restock_user_res.status_code == 403

    # Restock as admin (should succeed with 200)
    restock_admin_res = client.post(f"/api/vehicles/{vehicle_id}/restock?qty=5", headers=admin_headers)
    assert restock_admin_res.status_code == 200
    assert restock_admin_res.json()["quantity"] == 7


def test_search_and_update_and_delete_vehicle():
    # Login as admin to delete later
    admin_login = client.post("/api/auth/login", json={
        "email": "admin_inventory@example.com",
        "password": "adminpassword"
    })
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    # Login as regular user
    user_login = client.post("/api/auth/login", json={
        "email": "test_vehicle_user@example.com",
        "password": "password123"
    })
    headers = {"Authorization": f"Bearer {user_login.json()['access_token']}"}

    # Create a vehicle to test update, search, delete
    create_response = client.post("/api/vehicles", json={
        "make": "Tesla",
        "model": "Model 3",
        "category": "Electric",
        "price": 35000.0,
        "quantity": 3
    }, headers=headers)
    assert create_response.status_code == 201
    vehicle_id = create_response.json()["id"]

    # Search vehicle by make
    search_response = client.get(f"/api/vehicles/search?make=Tesla")
    assert search_response.status_code == 200
    assert len(search_response.json()) >= 1
    assert search_response.json()[0]["model"] == "Model 3"

    # Search vehicle by category
    search_response = client.get(f"/api/vehicles/search?category=Electric")
    assert search_response.status_code == 200
    assert len(search_response.json()) >= 1

    # Update vehicle (increase price)
    update_response = client.put(f"/api/vehicles/{vehicle_id}", json={
        "price": 38000.0
    }, headers=headers)
    assert update_response.status_code == 200
    assert update_response.json()["price"] == 38000.0

    # Try to delete as regular user (should fail with 403)
    delete_user_res = client.delete(f"/api/vehicles/{vehicle_id}", headers=headers)
    assert delete_user_res.status_code == 403

    # Delete as admin (should succeed with 200)
    delete_admin_res = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert delete_admin_res.status_code == 200
    assert delete_admin_res.json()["message"] == "Vehicle deleted successfully"

    # Make sure it's gone
    search_response = client.get(f"/api/vehicles")
    assert not any(v["id"] == vehicle_id for v in search_response.json())


