"""
Auth endpoint tests — TDD Red-Green-Refactor.

All tests run against an isolated in-memory SQLite DB provided by conftest.py.
No real car_dealership.db is touched.
"""

import pytest


# ---------------------------------------------------------------------------
# Registration — happy path
# ---------------------------------------------------------------------------

def test_register_success(client):
    """A valid payload registers a new user and returns a success message."""
    response = client.post("/api/auth/register", json={
        "username": "khushi",
        "email": "khushi@example.com",
        "password": "securepass123"
    })
    assert response.status_code == 200
    assert response.json()["message"] == "User registered successfully"


def test_register_password_is_hashed(client, db_session):
    """Password must be stored as a bcrypt hash, never plain-text."""
    from app.models.user import User

    client.post("/api/auth/register", json={
        "username": "hashtest",
        "email": "hash@example.com",
        "password": "plaintextpassword"
    })
    user = db_session.query(User).filter(User.email == "hash@example.com").first()
    assert user is not None
    assert user.password != "plaintextpassword"
    assert user.password.startswith("$2b$") or user.password.startswith("$2a$")


# ---------------------------------------------------------------------------
# Registration — security: admin self-promotion must be impossible
# ---------------------------------------------------------------------------

def test_register_cannot_self_promote_to_admin(client, db_session):
    """
    SECURITY: Sending is_admin=true or using 'admin' in username/email
    must NEVER grant admin privileges.  Every new user is always role='user'.
    """
    from app.models.user import User

    response = client.post("/api/auth/register", json={
        "username": "admin",           # 'admin' in username
        "email": "admin@test.com",     # 'admin' in email
        "password": "somepassword1",
        "is_admin": True               # explicit flag — must be ignored
    })
    # Registration itself should succeed (not rejected)
    assert response.status_code == 200

    # But the user must still be a plain user
    user = db_session.query(User).filter(User.email == "admin@test.com").first()
    assert user is not None
    assert user.role == "user", f"Expected role='user', got '{user.role}'"
    assert user.is_admin is False, "is_admin must be False after registration"


# ---------------------------------------------------------------------------
# Registration — validation errors
# ---------------------------------------------------------------------------

def test_register_duplicate_email_returns_400(client):
    """Registering with an already-used email must return 400."""
    payload = {
        "username": "firstuser",
        "email": "duplicate@example.com",
        "password": "password123"
    }
    client.post("/api/auth/register", json=payload)

    # Second attempt with same email
    response = client.post("/api/auth/register", json={
        "username": "seconduser",
        "email": "duplicate@example.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert "Email already registered" in response.json()["detail"]


def test_register_duplicate_username_returns_400(client):
    """Registering with an already-used username must return 400."""
    client.post("/api/auth/register", json={
        "username": "sameusername",
        "email": "first@example.com",
        "password": "password123"
    })

    response = client.post("/api/auth/register", json={
        "username": "sameusername",
        "email": "second@example.com",
        "password": "password123"
    })
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]


def test_register_missing_required_field_returns_422(client):
    """Omitting 'email' must return 422 Unprocessable Entity."""
    response = client.post("/api/auth/register", json={
        "username": "nopassword",
        # 'email' missing
        "password": "password123"
    })
    assert response.status_code == 422


def test_register_password_too_short_returns_422(client):
    """
    Password shorter than 8 characters must be rejected at schema level (422).
    Enforced via Pydantic min_length=8 on the password field.
    """
    response = client.post("/api/auth/register", json={
        "username": "shortpwduser",
        "email": "shortpwd@example.com",
        "password": "abc"   # only 3 chars
    })
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# Login — happy path
# ---------------------------------------------------------------------------

def test_login_success_returns_jwt(client):
    """Valid credentials must return an access_token with token_type='bearer'."""
    client.post("/api/auth/register", json={
        "username": "loginuser",
        "email": "login@example.com",
        "password": "securepass123"
    })
    response = client.post("/api/auth/login", json={
        "email": "login@example.com",
        "password": "securepass123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_returns_400(client):
    """Wrong password must be rejected with 400."""
    client.post("/api/auth/register", json={
        "username": "wrongpwduser",
        "email": "wrongpwd@example.com",
        "password": "correctpassword1"
    })
    response = client.post("/api/auth/login", json={
        "email": "wrongpwd@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 400