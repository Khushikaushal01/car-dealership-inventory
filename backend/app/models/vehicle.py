from sqlalchemy import Column, Integer, String, Float
from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(Integer, primary_key=True, index=True)
    make = Column(String, index=True)
    model = Column(String, index=True)
    category = Column(String, index=True)
    price = Column(Float)
    quantity = Column(Integer, default=0)
