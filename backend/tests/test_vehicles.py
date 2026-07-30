"""
Vehicle CRUD and inventory tests — TDD Red-Green-Refactor.

All tests run against an isolated in-memory SQLite DB provided by conftest.py.
No real car_dealership.db is touched.
"""

import pytest


# ---------------------------------------------------------------------------
# POST /api/vehicles — create
# ---------------------------------------------------------------------------

def test_create_vehicle_unauthorized(client):
    """Unauthenticated request to create a vehicle must return 401."""
    response = client.post("/api/vehicles", json={
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 5
    })
    assert response.status_code == 401


def test_create_vehicle_authorized(client, regular_user_token):
    """Authenticated user can add a vehicle; response includes all fields + id."""
    headers = {"Authorization": f"Bearer {regular_user_token}"}
    response = client.post("/api/vehicles", json={
        "make": "Toyota",
        "model": "Camry",
        "category": "Sedan",
        "price": 25000.0,
        "quantity": 5
    }, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["make"] == "Toyota"
    assert data["model"] == "Camry"
    assert data["price"] == 25000.0
    assert data["quantity"] == 5
    assert "id" in data


# ---------------------------------------------------------------------------
# POST /api/vehicles/:id/purchase
# ---------------------------------------------------------------------------

def test_purchase_decrements_quantity(client, regular_user_token):
    """Purchasing a vehicle must reduce its quantity by 1."""
    headers = {"Authorization": f"Bearer {regular_user_token}"}

    # Create vehicle with quantity=10
    create_resp = client.post("/api/vehicles", json={
        "make": "Honda",
        "model": "Civic",
        "category": "Sedan",
        "price": 22000.0,
        "quantity": 10
    }, headers=headers)
    assert create_resp.status_code == 201
    vehicle_id = create_resp.json()["id"]

    # Purchase once
    purchase_resp = client.post(f"/api/vehicles/{vehicle_id}/purchase", headers=headers)
    assert purchase_resp.status_code == 200
    assert purchase_resp.json()["quantity"] == 9


# ---------------------------------------------------------------------------
# POST /api/vehicles/:id/restock — admin only
# ---------------------------------------------------------------------------

def test_restock_requires_admin(client, regular_user_token, admin_user_token):
    """Regular users must get 403; admin must get 200 and correct new quantity."""
    user_headers = {"Authorization": f"Bearer {regular_user_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_user_token}"}

    # Create a vehicle
    create_resp = client.post("/api/vehicles", json={
        "make": "Ford",
        "model": "F-150",
        "category": "Truck",
        "price": 45000.0,
        "quantity": 2
    }, headers=user_headers)
    assert create_resp.status_code == 201
    vehicle_id = create_resp.json()["id"]

    # Regular user cannot restock
    resp = client.post(f"/api/vehicles/{vehicle_id}/restock?qty=5", headers=user_headers)
    assert resp.status_code == 403

    # Admin can restock
    resp = client.post(f"/api/vehicles/{vehicle_id}/restock?qty=5", headers=admin_headers)
    assert resp.status_code == 200
    assert resp.json()["quantity"] == 7


# ---------------------------------------------------------------------------
# GET /api/vehicles/search, PUT /api/vehicles/:id, DELETE /api/vehicles/:id
# ---------------------------------------------------------------------------

def test_search_update_delete_vehicle(client, regular_user_token, admin_user_token):
    """Full lifecycle: create → search → update price → delete (admin only)."""
    user_headers = {"Authorization": f"Bearer {regular_user_token}"}
    admin_headers = {"Authorization": f"Bearer {admin_user_token}"}

    # Create vehicle
    create_resp = client.post("/api/vehicles", json={
        "make": "Tesla",
        "model": "Model 3",
        "category": "Electric",
        "price": 35000.0,
        "quantity": 3
    }, headers=user_headers)
    assert create_resp.status_code == 201
    vehicle_id = create_resp.json()["id"]

    # Search by make
    search_resp = client.get("/api/vehicles/search?make=Tesla")
    assert search_resp.status_code == 200
    results = search_resp.json()
    assert len(results) >= 1
    assert results[0]["model"] == "Model 3"

    # Search by category
    search_resp = client.get("/api/vehicles/search?category=Electric")
    assert search_resp.status_code == 200
    assert len(search_resp.json()) >= 1

    # Update price
    update_resp = client.put(f"/api/vehicles/{vehicle_id}", json={"price": 38000.0}, headers=user_headers)
    assert update_resp.status_code == 200
    assert update_resp.json()["price"] == 38000.0

    # Regular user cannot delete
    del_user_resp = client.delete(f"/api/vehicles/{vehicle_id}", headers=user_headers)
    assert del_user_resp.status_code == 403

    # Admin can delete
    del_admin_resp = client.delete(f"/api/vehicles/{vehicle_id}", headers=admin_headers)
    assert del_admin_resp.status_code == 200
    assert del_admin_resp.json()["message"] == "Vehicle deleted successfully"

    # Verify deletion
    list_resp = client.get("/api/vehicles")
    assert not any(v["id"] == vehicle_id for v in list_resp.json())
