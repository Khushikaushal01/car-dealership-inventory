from dotenv import load_dotenv

# Load .env before any other import so JWT_SECRET is available to jwt.py
load_dotenv()

from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.vehicles import router as vehicles_router
from app.database import Base, engine
from app.models.user import User
from app.models.vehicle import Vehicle
import sqlite3

Base.metadata.create_all(bind=engine)

# Auto-migrate: add missing columns on existing databases
def run_migrations():
    """Add missing columns to existing SQLite DB without dropping data."""
    try:
        conn = sqlite3.connect(engine.url.database)
        cursor = conn.cursor()
        cursor.execute("PRAGMA table_info(users)")
        existing_cols = {row[1] for row in cursor.fetchall()}
        if "is_admin" not in existing_cols:
            cursor.execute("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0")
        if "role" not in existing_cols:
            cursor.execute("ALTER TABLE users ADD COLUMN role VARCHAR DEFAULT 'user'")
        conn.commit()
        conn.close()
    except Exception:
        pass  # Ignore if DB not yet created (create_all will handle it)

run_migrations()


def seed_initial_data():
    """Auto-seed sample vehicles if database is empty (ideal for cloud free tiers)."""
    from app.database import SessionLocal
    db = SessionLocal()
    try:
        if db.query(Vehicle).count() == 0:
            sample_vehicles = [
                Vehicle(make="TOYOTA", model="SUPRA MK4", category="SPORTS CAR", price=450000.0, quantity=5),
                Vehicle(make="NISSAN", model="SKYLINE GT-R R34", category="SPORTS CAR", price=850000.0, quantity=2),
                Vehicle(make="HONDA", model="CIVIC TYPE R", category="HATCHBACK", price=350000.0, quantity=12),
                Vehicle(make="MAHINDRA", model="THAR 4X4", category="SUV", price=180000.0, quantity=9),
            ]
            db.add_all(sample_vehicles)
            db.commit()
    except Exception:
        db.rollback()
    finally:
        db.close()


seed_initial_data()

app = FastAPI()

app.include_router(auth_router)
app.include_router(vehicles_router)