from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class VehicleBase(BaseModel):
    type: str
    plate_number: str
    brand: Optional[str] = None
    model: Optional[str] = None
    color: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class VehicleOut(VehicleBase):
    id: int
    driver_id: int

    class Config:
        from_attributes = True

class DriverProfileBase(BaseModel):
    license_number: Optional[str] = None
    status: str = "offline"

class DriverProfileCreate(DriverProfileBase):
    pass

class DriverProfileUpdate(BaseModel):
    status: Optional[str] = None
    current_lat: Optional[float] = None
    current_lng: Optional[float] = None

class DriverProfileOut(DriverProfileBase):
    id: int
    user_id: int
    verified: bool
    rating: float
    review_count: int
    completed_rides: int
    current_lat: Optional[float]
    current_lng: Optional[float]
    vehicles: List[VehicleOut] = []

    class Config:
        from_attributes = True

class RideBase(BaseModel):
    pickup_address: str
    pickup_lat: float
    pickup_lng: float
    dropoff_address: str
    dropoff_lat: float
    dropoff_lng: float
    distance_km: float
    price: int
    notes: Optional[str] = None

class RideCreate(RideBase):
    pass

class RideUpdate(BaseModel):
    status: str

class RideOut(RideBase):
    id: int
    customer_id: int
    driver_id: Optional[int]
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
