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

# Add these routes to your routes.py file for better order item management

@router.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Get a specific order by ID"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.patch("/orders/{order_id}/processing", response_model=schemas.Order)
def mark_order_as_processing(order_id: int, db: Session = Depends(get_db)):
    """Mark order as processing"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.processing
    db.commit()
    db.refresh(order)
    return order

@router.patch("/orders/{order_id}/delivered", response_model=schemas.Order)
def mark_order_as_delivered(order_id: int, db: Session = Depends(get_db)):
    """Mark order as delivered"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.delivered
    db.commit()
    db.refresh(order)
    return order

@router.get("/orders/{order_id}/items", response_model=list[schemas.OrderItem])
def get_order_items(order_id: int, db: Session = Depends(get_db)):
    """Get all items for a specific order"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order.items

@router.get("/order-items/", response_model=list[dict])
def get_all_order_items(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    """Get all order items with order information flattened"""
    orders = db.query(models.Order).offset(skip).limit(limit).all()
    
    flattened_items = []
    for order in orders:
        for item in order.items:
            flattened_items.append({
                "id": item.id,
                "order_id": order.id,
                "crystal": item.crystal,
                "form": item.form,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "customer_name": order.customer_name,
                "email": order.email,
                "phone": order.phone,
                "address": order.address,
                "order_status": order.status.value,
                "created_at": order.created_at,
                "total_amount": order.total_amount
            })
    
    return flattened_items

@router.get("/orders/search/{search_term}", response_model=list[schemas.Order])
def search_orders(
    search_term: str, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    """Search orders by customer name, email, or phone"""
    search_pattern = f"%{search_term}%"
    return db.query(models.Order).filter(
        (models.Order.customer_name.ilike(search_pattern)) |
        (models.Order.email.ilike(search_pattern)) |
        (models.Order.phone.ilike(search_pattern))
    ).offset(skip).limit(limit).all()

@router.get("/orders/status/{status}", response_model=list[schemas.Order])
def get_orders_by_status(
    status: schemas.OrderStatus,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get orders filtered by status"""
    return db.query(models.Order).filter(
        models.Order.status == status
    ).offset(skip).limit(limit).all()

@router.get("/orders/stats/summary")
def get_order_statistics(db: Session = Depends(get_db)):
    """Get statistics about orders"""
    total_orders = db.query(models.Order).count()
    pending_orders = db.query(models.Order).filter(
        models.Order.status == schemas.OrderStatus.pending
    ).count()
    paid_orders = db.query(models.Order).filter(
        models.Order.status == schemas.OrderStatus.paid
    ).count()
    processing_orders = db.query(models.Order).filter(
        models.Order.status == schemas.OrderStatus.processing
    ).count()
    shipped_orders = db.query(models.Order).filter(
        models.Order.status == schemas.OrderStatus.shipped
    ).count()
    delivered_orders = db.query(models.Order).filter(
        models.Order.status == schemas.OrderStatus.delivered
    ).count()
    
    total_revenue = db.query(
        db.func.sum(models.Order.total_amount)
    ).filter(
        models.Order.status.in_([
            schemas.OrderStatus.paid,
            schemas.OrderStatus.processing,
            schemas.OrderStatus.shipped,
            schemas.OrderStatus.delivered
        ])
    ).scalar() or 0
    
    # Get item statistics
    total_items = db.query(models.OrderItem).count()
    
    return {
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "paid_orders": paid_orders,
        "processing_orders": processing_orders,
        "shipped_orders": shipped_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": float(total_revenue),
        "total_items": total_items
    }