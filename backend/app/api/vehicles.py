from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.vehicle import Vehicle
from app.schemas.vehicle import VehicleCreate, VehicleUpdate, VehicleOut
from app.api.auth import get_current_user, get_current_admin
from app.models.user import User

router = APIRouter(
    prefix="/api/vehicles",
    tags=["Vehicles"]
)


@router.post("", response_model=VehicleOut, status_code=status.HTTP_201_CREATED)
def create_vehicle(
    vehicle_in: VehicleCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_vehicle = Vehicle(
        make=vehicle_in.make,
        model=vehicle_in.model,
        category=vehicle_in.category,
        price=vehicle_in.price,
        quantity=vehicle_in.quantity
    )
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.get("", response_model=List[VehicleOut])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()


@router.get("/search", response_model=List[VehicleOut])
def search_vehicles(
    make: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Vehicle)
    if make:
        query = query.filter(Vehicle.make.icontains(make))
    if model:
        query = query.filter(Vehicle.model.icontains(model))
    if category:
        query = query.filter(Vehicle.category.icontains(category))
    if min_price is not None:
        query = query.filter(Vehicle.price >= min_price)
    if max_price is not None:
        query = query.filter(Vehicle.price <= max_price)
    return query.all()


@router.put("/{id}", response_model=VehicleOut)
def update_vehicle(
    id: int,
    vehicle_in: VehicleUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not db_vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    
    update_data = vehicle_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_vehicle, field, value)
    
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


@router.delete("/{id}")
def delete_vehicle(
    id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not db_vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    db.delete(db_vehicle)
    db.commit()
    return {"message": "Vehicle deleted successfully"}


# Inventory purchase endpoint with path parameter
@router.post("/{id}/purchase", response_model=VehicleOut)
def purchase_vehicle_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Purchase a vehicle by decrementing its quantity by 1.
    """
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not db_vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    if db_vehicle.quantity <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Vehicle out of stock"
        )
    db_vehicle.quantity -= 1
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


# Inventory purchase endpoint with body parameter /api/vehicles/purchase
@router.post("/purchase", response_model=VehicleOut)
def purchase_vehicle_body(
    payload: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    vehicle_id = payload.get("vehicle_id")
    if not vehicle_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="vehicle_id is required"
        )
    return purchase_vehicle_by_id(id=vehicle_id, db=db, current_user=current_user)


# Inventory restock endpoint with path parameter
@router.post("/{id}/restock", response_model=VehicleOut)
def restock_vehicle_by_id(
    id: int,
    quantity: int = Query(1, alias="qty", description="Quantity to add"),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    db_vehicle = db.query(Vehicle).filter(Vehicle.id == id).first()
    if not db_vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Vehicle not found"
        )
    db_vehicle.quantity += quantity
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle


# Inventory restock endpoint with body parameter /api/vehicles/restock
@router.post("/restock", response_model=VehicleOut)
def restock_vehicle_body(
    payload: dict,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    vehicle_id = payload.get("vehicle_id")
    quantity = payload.get("quantity", 1)
    if not vehicle_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="vehicle_id is required"
        )
    return restock_vehicle_by_id(id=vehicle_id, quantity=quantity, db=db, current_admin=current_admin)
