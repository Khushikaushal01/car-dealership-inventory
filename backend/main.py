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

app = FastAPI()

app.include_router(auth_router)
app.include_router(vehicles_router)