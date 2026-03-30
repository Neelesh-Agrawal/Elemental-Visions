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

