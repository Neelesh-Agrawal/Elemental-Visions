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

def get_services(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Service).offset(skip).limit(limit).all()

def get_service_by_id(db: Session, service_id: str):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

def update_service(db: Session, service_id: str, service_update: schemas.ServiceCreate):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Update service fields
    service.name = service_update.name
    service.description = service_update.description
    service.base_price = service_update.basePrice
    service.duration = service_update.duration
    service.type = service_update.type
    
    # Remove existing sessions
    db.query(models.ServiceSession).filter(models.ServiceSession.service_id == service_id).delete()
    
    # Add updated sessions
    for session in service_update.sessions:
        db_session = models.ServiceSession(
            id=session.id,
            service_id=service_id,
            name=session.name,
            duration=session.duration,
            price=str(session.price),
            description=session.description,
        )
        db.add(db_session)
    
    db.commit()
    db.refresh(service)
    return service

def delete_service(db: Session, service_id: str):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    db.delete(service)  # Cascade will handle sessions
    db.commit()
    return {"message": "Service deleted successfully"}

def get_service_sessions(db: Session, service_id: str):
    service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service.sessions
