from fastapi import FastAPI
from app.api.auth import router as auth_router
from app.api.vehicles import router as vehicles_router
from app.database import Base, engine
from app.models.user import User
from app.models.vehicle import Vehicle

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router)
app.include_router(vehicles_router)