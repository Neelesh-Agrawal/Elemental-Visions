from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)

@router.get("/orders/", response_model=list[schemas.Order])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_orders(db, skip=skip, limit=limit)


@router.patch("/orders/{order_id}/pay", response_model=schemas.Order)
def mark_order_as_paid(order_id: int, db: Session = Depends(get_db)):
    return crud.mark_order_as_paid(db=db, order_id=order_id)

@router.patch("/orders/{order_id}/pending", response_model=schemas.Order)
def mark_order_as_pending(order_id: int, db: Session = Depends(get_db)):
    return crud.mark_order_as_pending(db=db, order_id=order_id)

@router.patch("/orders/{order_id}/reject", response_model=schemas.Order)
def mark_order_as_rejected(order_id: int, db: Session = Depends(get_db)):
    return crud.mark_order_as_rejected(db=db, order_id=order_id)

@router.patch("/orders/{order_id}/ship", response_model=schemas.Order)
def mark_order_as_shipped_or_delivered(
    order_id: int, status: schemas.OrderStatus, db: Session = Depends(get_db)
):
    return crud.update_shipment_status(db=db, order_id=order_id, status=status)

<<<<<<< HEAD
# Service Booking Routes
@router.post("/service-bookings/", response_model=schemas.ServiceBooking)
def create_service_booking(booking: schemas.ServiceBookingCreate, db: Session = Depends(get_db)):
    return crud.create_service_booking(db=db, booking=booking)

@router.get("/service-bookings/", response_model=list[schemas.ServiceBooking])
def read_service_bookings(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_service_bookings(db, skip=skip, limit=limit)

@router.patch("/service-bookings/{booking_id}/pay", response_model=schemas.ServiceBooking)
def mark_service_booking_as_paid(booking_id: int, db: Session = Depends(get_db)):
    return crud.mark_service_booking_as_paid(db=db, booking_id=booking_id)

@router.patch("/service-bookings/{booking_id}/pending", response_model=schemas.ServiceBooking)
def mark_service_booking_as_pending(booking_id: int, db: Session = Depends(get_db)):
    return crud.mark_service_booking_as_pending(db=db, booking_id=booking_id)

@router.patch("/service-bookings/{booking_id}/reject", response_model=schemas.ServiceBooking)
def mark_service_booking_as_rejected(booking_id: int, db: Session = Depends(get_db)):
    return crud.mark_service_booking_as_rejected(db=db, booking_id=booking_id)

=======
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
