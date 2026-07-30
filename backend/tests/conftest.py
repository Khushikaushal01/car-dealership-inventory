"""
Shared pytest fixtures for all test modules.

Uses an isolated in-memory SQLite database (StaticPool) so tests never
touch the real car_dealership.db.  A fresh DB is created and torn down
for every test function via the `db_session` fixture.
"""

import os
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

# Set JWT_SECRET before any app module is imported so jwt.py can read it.
os.environ.setdefault("JWT_SECRET", "test-only-secret-do-not-use-in-production")

from main import app                        # noqa: E402  (must be after env set)
from app.database import Base, get_db       # noqa: E402
from app.models.user import User            # noqa: E402
from app.core.security import hash_password # noqa: E402


# ---------------------------------------------------------------------------
# In-memory SQLite engine shared across all tests in a session
# ---------------------------------------------------------------------------
TEST_DATABASE_URL = "sqlite://"  # pure in-memory

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,  # single connection reused — required for in-memory SQLite
)

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)


@pytest.fixture(autouse=True)
def db_session():
    """
    Create all tables before each test and drop them after.
    This guarantees full isolation between test functions.
    """
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()

    # Override the FastAPI dependency so every request gets this session
    def override_get_db():
        try:
            yield db
        finally:
            pass  # do not close here; fixture handles lifecycle

    app.dependency_overrides[get_db] = override_get_db

    yield db

    # Teardown
    db.close()
    Base.metadata.drop_all(bind=test_engine)
    app.dependency_overrides.clear()


@pytest.fixture()
def client(db_session):
    """Return a TestClient wired to the isolated DB."""
    return TestClient(app)


@pytest.fixture()
def regular_user_token(client):
    """Register a regular user and return their JWT token."""
    client.post("/api/auth/register", json={
        "username": "regularuser",
        "email": "regular@example.com",
        "password": "securepass123"
    })
    resp = client.post("/api/auth/login", json={
        "email": "regular@example.com",
        "password": "securepass123"
    })
    return resp.json()["access_token"]


@pytest.fixture()
def admin_user_token(client, db_session):
    """
    Register a user then manually promote to admin in the test DB.
    This reflects real-world flow: admins are created via DB, not registration.
    """
    client.post("/api/auth/register", json={
        "username": "adminuser",
        "email": "admin@example.com",
        "password": "adminpass123"
    })
    # Promote via DB (the only correct way — no registration shortcut)
    admin = db_session.query(User).filter(User.email == "admin@example.com").first()
    admin.is_admin = True
    admin.role = "admin"
    db_session.commit()

    resp = client.post("/api/auth/login", json={
        "email": "admin@example.com",
        "password": "adminpass123"
    })
    return resp.json()["access_token"]
