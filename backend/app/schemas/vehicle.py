from pydantic import BaseModel, ConfigDict
from typing import Optional


class VehicleBase(BaseModel):
    make: str
    model: str
    category: str
    price: float
    quantity: int


class VehicleCreate(VehicleBase):
    pass


class VehicleUpdate(BaseModel):
    make: Optional[str] = None
    model: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    quantity: Optional[int] = None


class VehicleOut(VehicleBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
