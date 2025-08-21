from sqlalchemy.orm import Session
from fastapi import HTTPException
from . import models, schemas

def create_order(db: Session, order: schemas.OrderCreate):
    db_order = models.Order(
        customer_name=order.customer_name,
        email=order.email,
        phone=order.phone,
        address=order.address,
        total_amount=order.total_amount,
        status=order.status,
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Add order items
    for item in order.items:
        db_item = models.OrderItem(
            order_id=db_order.id,
            crystal=item.crystal,
            form=item.form,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        db.add(db_item)
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.Order).offset(skip).limit(limit).all()


def mark_order_as_paid(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.paid
    db.commit()
    db.refresh(order)
    return order

def mark_order_as_pending(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.pending
    db.commit()
    db.refresh(order)
    return order

def mark_order_as_rejected(db: Session, order_id: int):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.rejected
    db.commit()
    db.refresh(order)
    return order

def update_shipment_status(db: Session, order_id: int, status: schemas.OrderStatus):
    if status not in [schemas.OrderStatus.shipped, schemas.OrderStatus.delivered]:
        raise HTTPException(status_code=400, detail="Invalid status for shipping")
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = status
    db.commit()
    db.refresh(order)
    return order

def create_service(db: Session, service: schemas.ServiceCreate):
    # Check if service with this ID already exists
    existing_service = db.query(models.Service).filter(models.Service.id == service.id).first()
    if existing_service:
        raise HTTPException(status_code=400, detail="Service with this ID already exists")
    
    db_service = models.Service(
        id=service.id,
        name=service.name,
        description=service.description,
        base_price=service.basePrice,
        duration=service.duration,
        type=service.type,
    )
    db.add(db_service)
    db.commit()
    db.refresh(db_service)

    # Add service sessions
    for session in service.sessions:
        # Check if session with this ID already exists
        existing_session = db.query(models.ServiceSession).filter(models.ServiceSession.id == session.id).first()
        if existing_session:
            raise HTTPException(status_code=400, detail=f"Session with ID {session.id} already exists")
        
        db_session = models.ServiceSession(
            id=session.id,
            service_id=db_service.id,
            name=session.name,
            duration=session.duration,
            price=str(session.price),  # Convert to string for consistency
            description=session.description,
        )
        db.add(db_session)
    
    db.commit()
    db.refresh(db_service)
    return db_service

def create_service_booking(db: Session, booking: schemas.ServiceBookingCreate):
    """Create a new service booking with items"""
    db_booking = models.ServiceBooking(
        customer_name=booking.customer_name,
        email=booking.email,
        phone=booking.phone,
        total_amount=booking.total_amount,
        status=booking.status,
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    # Add booking items
    for item in booking.items:
        db_item = models.ServiceBookingItem(
            booking_id=db_booking.id,
            service_name=item.service_name,
            session_name=item.session_name,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

def get_service_bookings(db: Session, skip: int = 0, limit: int = 100):
    """Retrieve service bookings with pagination"""
    return db.query(models.ServiceBooking).offset(skip).limit(limit).all()

def get_service_booking_by_id(db: Session, booking_id: int):
    """Get a specific service booking by ID"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    return booking

def mark_service_booking_as_paid(db: Session, booking_id: int):
    """Mark service booking as paid"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.paid
    db.commit()
    db.refresh(booking)
    return booking

def mark_service_booking_as_pending(db: Session, booking_id: int):
    """Mark service booking as pending"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.pending
    db.commit()
    db.refresh(booking)
    return booking

def mark_service_booking_as_rejected(db: Session, booking_id: int):
    """Mark service booking as rejected"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.rejected
    db.commit()
    db.refresh(booking)
    return booking

def mark_service_booking_as_processing(db: Session, booking_id: int):
    """Mark service booking as processing"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.processing
    db.commit()
    db.refresh(booking)
    return booking

def mark_service_booking_as_shipped(db: Session, booking_id: int):
    """Mark service booking as shipped"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.shipped
    db.commit()
    db.refresh(booking)
    return booking

def mark_service_booking_as_delivered(db: Session, booking_id: int):
    """Mark service booking as delivered"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    booking.status = schemas.OrderStatus.delivered
    db.commit()
    db.refresh(booking)
    return booking

def update_service_booking_status(db: Session, booking_id: int, status: schemas.OrderStatus):
    """Update service booking status to any valid status"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    
    # Validate status
    valid_statuses = [
        schemas.OrderStatus.pending,
        schemas.OrderStatus.paid,
        schemas.OrderStatus.processing,
        schemas.OrderStatus.shipped,
        schemas.OrderStatus.delivered,
        schemas.OrderStatus.rejected
    ]
    
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    booking.status = status
    db.commit()
    db.refresh(booking)
    return booking

def delete_service_booking(db: Session, booking_id: int):
    """Delete a service booking (soft delete by marking as rejected or hard delete)"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    
    db.delete(booking)  # This will cascade delete the items due to the relationship
    db.commit()
    return {"message": "Service booking deleted successfully"}

def get_service_booking_items(db: Session, booking_id: int):
    """Get all items for a specific service booking"""
    booking = db.query(models.ServiceBooking).filter(models.ServiceBooking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    return booking.items

def search_service_bookings(db: Session, search_term: str, skip: int = 0, limit: int = 100):
    """Search service bookings by customer name, email, or phone"""
    search_pattern = f"%{search_term}%"
    return db.query(models.ServiceBooking).filter(
        (models.ServiceBooking.customer_name.ilike(search_pattern)) |
        (models.ServiceBooking.email.ilike(search_pattern)) |
        (models.ServiceBooking.phone.ilike(search_pattern))
    ).offset(skip).limit(limit).all()

def get_service_bookings_by_status(db: Session, status: schemas.OrderStatus, skip: int = 0, limit: int = 100):
    """Get service bookings filtered by status"""
    return db.query(models.ServiceBooking).filter(
        models.ServiceBooking.status == status
    ).offset(skip).limit(limit).all()

def get_service_booking_stats(db: Session):
    """Get statistics about service bookings"""
    total_bookings = db.query(models.ServiceBooking).count()
    pending_bookings = db.query(models.ServiceBooking).filter(
        models.ServiceBooking.status == schemas.OrderStatus.pending
    ).count()
    paid_bookings = db.query(models.ServiceBooking).filter(
        models.ServiceBooking.status == schemas.OrderStatus.paid
    ).count()
    completed_bookings = db.query(models.ServiceBooking).filter(
        models.ServiceBooking.status == schemas.OrderStatus.delivered
    ).count()
    
    total_revenue = db.query(
        db.func.sum(models.ServiceBooking.total_amount)
    ).filter(
        models.ServiceBooking.status.in_([
            schemas.OrderStatus.paid,
            schemas.OrderStatus.processing,
            schemas.OrderStatus.shipped,
            schemas.OrderStatus.delivered
        ])
    ).scalar() or 0
    
    return {
        "total_bookings": total_bookings,
        "pending_bookings": pending_bookings,
        "paid_bookings": paid_bookings,
        "completed_bookings": completed_bookings,
        "total_revenue": float(total_revenue)
    }