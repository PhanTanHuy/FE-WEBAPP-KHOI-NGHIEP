from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import User, DriverProfile, Vehicle, Ride, AuditLog
from app.schemas.ride import DriverProfileCreate, DriverProfileUpdate, DriverProfileOut, VehicleCreate, VehicleOut, RideCreate, RideUpdate, RideOut
from app.api.deps import get_current_user

router = APIRouter(prefix="/rides", tags=["Rides"])

def log_audit(db: Session, user_id: int, action: str, entity: str, entity_id: int = None, details: str = None):
    audit = AuditLog(user_id=user_id, action=action, entity=entity, entity_id=entity_id, details=details)
    db.add(audit)
    db.commit()

# --- Driver Profile ---
@router.post("/driver/profile", response_model=DriverProfileOut)
def create_or_update_driver_profile(profile: DriverProfileCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if db_profile:
        for key, value in profile.model_dump(exclude_unset=True).items():
            setattr(db_profile, key, value)
    else:
        db_profile = DriverProfile(**profile.model_dump(), user_id=current_user.id)
        db.add(db_profile)
        
    db.commit()
    db.refresh(db_profile)
    log_audit(db, current_user.id, "update_driver_profile", "DriverProfile", db_profile.id)
    return db_profile

@router.get("/driver/profile", response_model=DriverProfileOut)
def get_driver_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    return profile

@router.put("/driver/location")
def update_driver_location(lat: float, lng: float, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    profile.current_lat = lat
    profile.current_lng = lng
    db.commit()
    return {"status": "ok"}

# --- Vehicle ---
@router.post("/driver/vehicles", response_model=VehicleOut)
def add_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Driver profile not found")
    
    db_vehicle = Vehicle(**vehicle.model_dump(), driver_id=profile.id)
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    log_audit(db, current_user.id, "add_vehicle", "Vehicle", db_vehicle.id)
    return db_vehicle

# --- Rides ---
@router.post("/request", response_model=RideOut)
def request_ride(ride: RideCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    db_ride = Ride(**ride.model_dump(), customer_id=current_user.id)
    db.add(db_ride)
    db.commit()
    db.refresh(db_ride)
    log_audit(db, current_user.id, "request_ride", "Ride", db_ride.id)
    return db_ride

@router.get("/available", response_model=List[RideOut])
def get_available_rides(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if not profile or not profile.verified:
        raise HTTPException(status_code=403, detail="Only verified drivers can see available rides")
    
    rides = db.query(Ride).filter(Ride.status == "pending").all()
    return rides

@router.get("/my-rides", response_model=List[RideOut])
def get_my_rides(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Rides where user is customer or driver
    rides = db.query(Ride).filter(
        (Ride.customer_id == current_user.id) | 
        (Ride.driver.has(user_id=current_user.id))
    ).order_by(Ride.created_at.desc()).all()
    return rides

@router.post("/{ride_id}/accept", response_model=RideOut)
def accept_ride(ride_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = db.query(DriverProfile).filter(DriverProfile.user_id == current_user.id).first()
    if not profile or not profile.verified:
        raise HTTPException(status_code=403, detail="Not authorized as verified driver")
    
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    if ride.status != "pending":
        raise HTTPException(status_code=400, detail="Ride is no longer pending")
    
    ride.status = "accepted"
    ride.driver_id = profile.id
    db.commit()
    db.refresh(ride)
    log_audit(db, current_user.id, "accept_ride", "Ride", ride.id)
    return ride

@router.put("/{ride_id}/status", response_model=RideOut)
def update_ride_status(ride_id: int, status: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ride = db.query(Ride).filter(Ride.id == ride_id).first()
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if ride.driver and ride.driver.user_id == current_user.id:
        pass # OK
    elif ride.customer_id == current_user.id and status == "cancelled":
        pass # OK to cancel
    else:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    ride.status = status
    if status == "completed" and ride.driver:
        ride.driver.completed_rides += 1
        
    db.commit()
    db.refresh(ride)
    log_audit(db, current_user.id, f"update_ride_status_{status}", "Ride", ride.id)
    return ride
