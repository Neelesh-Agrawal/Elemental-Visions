import json
import os
from datetime import datetime, timezone
from typing import Optional

import razorpay
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

router = APIRouter()
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _get_auth_secret() -> str:
    secret = os.getenv("ADMIN_JWT_SECRET")
    if not secret:
        raise HTTPException(
            status_code=500, detail="ADMIN_JWT_SECRET is not configured"
        )
    return secret


def _create_token(data: dict, expires_delta_seconds: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        **data,
        "iat": int(now.timestamp()),
        "exp": int(now.timestamp()) + expires_delta_seconds,
    }
    return jwt.encode(payload, _get_auth_secret(), algorithm="HS256")


def _set_auth_cookies(
    response: Response, access_token: str, refresh_token: str
) -> None:
    cookie_secure = os.getenv("AUTH_COOKIE_SECURE", "false").lower() == "true"
    response.set_cookie(
        key="admin_access_token",
        value=access_token,
        httponly=True,
        secure=cookie_secure,
        samesite="lax",
        max_age=60 * int(os.getenv("ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES", "15")),
        path="/",
    )
    response.set_cookie(
        key="admin_refresh_token",
        value=refresh_token,
        httponly=True,
        secure=cookie_secure,
        samesite="lax",
        max_age=86400 * int(os.getenv("ADMIN_REFRESH_TOKEN_EXPIRE_DAYS", "7")),
        path="/",
    )


def _clear_auth_cookies(response: Response) -> None:
    response.delete_cookie("admin_access_token", path="/")
    response.delete_cookie("admin_refresh_token", path="/")


def _decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, _get_auth_secret(), algorithms=["HS256"])
    except JWTError:
        return None


def get_current_admin(
    request: Request, db: Session = Depends(get_db)
) -> models.AdminUser:
    token = request.cookies.get("admin_access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    payload = _decode_token(token)
    if not payload or payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    admin_id = payload.get("sub")
    if not admin_id:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

    admin = (
        db.query(models.AdminUser).filter(models.AdminUser.id == int(admin_id)).first()
    )
    if not admin or not admin.is_active:
        raise HTTPException(status_code=401, detail="Admin user not found")
    return admin


def ensure_initial_admin_user() -> None:
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    if not admin_email or not admin_password:
        return

    db = SessionLocal()
    try:
        existing_admin = (
            db.query(models.AdminUser)
            .filter(models.AdminUser.email == admin_email)
            .first()
        )
        if existing_admin:
            return

        admin = models.AdminUser(
            email=admin_email,
            password_hash=pwd_context.hash(admin_password),
            is_active=True,
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()


ensure_initial_admin_user()


@router.post("/auth/admin/login", response_model=schemas.AuthResponse)
def admin_login(
    payload: schemas.AdminLoginRequest,
    response: Response,
    db: Session = Depends(get_db),
):
    admin = (
        db.query(models.AdminUser)
        .filter(models.AdminUser.email == payload.email)
        .first()
    )
    if not admin or not pwd_context.verify(payload.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if not admin.is_active:
        raise HTTPException(status_code=403, detail="Admin user is inactive")

    access_token = _create_token(
        {"sub": str(admin.id), "type": "access"},
        int(os.getenv("ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES", "15")) * 60,
    )
    refresh_token = _create_token(
        {"sub": str(admin.id), "type": "refresh"},
        int(os.getenv("ADMIN_REFRESH_TOKEN_EXPIRE_DAYS", "7")) * 86400,
    )
    _set_auth_cookies(response, access_token, refresh_token)

    return schemas.AuthResponse(
        success=True,
        message="Login successful",
        user=schemas.AdminUserResponse(id=admin.id, email=admin.email),
    )


@router.post("/auth/admin/refresh", response_model=schemas.AuthResponse)
def admin_refresh_token(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    refresh_token = request.cookies.get("admin_refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    payload = _decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    admin_id = payload.get("sub")
    admin = (
        db.query(models.AdminUser).filter(models.AdminUser.id == int(admin_id)).first()
    )
    if not admin or not admin.is_active:
        raise HTTPException(status_code=401, detail="Admin user not found")

    new_access_token = _create_token(
        {"sub": str(admin.id), "type": "access"},
        int(os.getenv("ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES", "15")) * 60,
    )
    _set_auth_cookies(response, new_access_token, refresh_token)

    return schemas.AuthResponse(
        success=True,
        message="Token refreshed",
        user=schemas.AdminUserResponse(id=admin.id, email=admin.email),
    )


@router.get("/auth/admin/me", response_model=schemas.AdminUserResponse)
def admin_me(current_admin: models.AdminUser = Depends(get_current_admin)):
    return schemas.AdminUserResponse(id=current_admin.id, email=current_admin.email)


@router.post("/auth/admin/logout", response_model=schemas.AuthResponse)
def admin_logout(response: Response):
    _clear_auth_cookies(response)
    return schemas.AuthResponse(success=True, message="Logged out")


def get_razorpay_client() -> razorpay.Client:
    key_id = os.getenv("RAZORPAY_KEY_ID")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET")
    if not key_id or not key_secret:
        raise HTTPException(
            status_code=500,
            detail="Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
        )
    return razorpay.Client(auth=(key_id, key_secret))


def _create_razorpay_order(
    entity_type: str, entity_id: int, amount: float, notes: dict
):
    client = get_razorpay_client()
    currency = os.getenv("RAZORPAY_CURRENCY", "INR").upper()
    amount_in_paise = int(round(amount * 100))
    if amount_in_paise <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than zero")

    order_data = {
        "amount": amount_in_paise,
        "currency": currency,
        "receipt": f"ev-{entity_type[:3]}-{entity_id}-{int(datetime.now(timezone.utc).timestamp())}",
        "notes": notes,
    }
    return client.order.create(data=order_data), amount_in_paise, currency


@router.post(
    "/payments/orders/{order_id}/create-razorpay-order",
    response_model=schemas.RazorpayCreateOrderResponse,
)
def create_razorpay_order_for_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.status == schemas.OrderStatus.paid:
        raise HTTPException(status_code=400, detail="Order is already paid")

    rzp_order, amount_in_paise, currency = _create_razorpay_order(
        entity_type="order",
        entity_id=order.id,
        amount=order.total_amount,
        notes={
            "entity_type": "order",
            "entity_id": str(order.id),
            "email": order.email,
        },
    )

    order.razorpay_order_id = rzp_order["id"]
    order.payment_status = "created"
    order.payment_amount = order.total_amount
    order.payment_currency = currency
    db.commit()

    return schemas.RazorpayCreateOrderResponse(
        key_id=os.getenv("RAZORPAY_KEY_ID", ""),
        razorpay_order_id=rzp_order["id"],
        amount=amount_in_paise,
        currency=currency,
        entity_type="order",
        entity_id=order.id,
    )


@router.post(
    "/payments/service-bookings/{booking_id}/create-razorpay-order",
    response_model=schemas.RazorpayCreateOrderResponse,
)
def create_razorpay_order_for_service_booking(
    booking_id: int, db: Session = Depends(get_db)
):
    booking = (
        db.query(models.ServiceBooking)
        .filter(models.ServiceBooking.id == booking_id)
        .first()
    )
    if not booking:
        raise HTTPException(status_code=404, detail="Service booking not found")
    if booking.status == schemas.OrderStatus.paid:
        raise HTTPException(status_code=400, detail="Service booking is already paid")

    rzp_order, amount_in_paise, currency = _create_razorpay_order(
        entity_type="service_booking",
        entity_id=booking.id,
        amount=booking.total_amount,
        notes={
            "entity_type": "service_booking",
            "entity_id": str(booking.id),
            "email": booking.email,
        },
    )

    booking.razorpay_order_id = rzp_order["id"]
    booking.payment_status = "created"
    booking.payment_amount = booking.total_amount
    booking.payment_currency = currency
    db.commit()

    return schemas.RazorpayCreateOrderResponse(
        key_id=os.getenv("RAZORPAY_KEY_ID", ""),
        razorpay_order_id=rzp_order["id"],
        amount=amount_in_paise,
        currency=currency,
        entity_type="service_booking",
        entity_id=booking.id,
    )


@router.post("/payments/verify", response_model=schemas.RazorpayVerifyPaymentResponse)
def verify_razorpay_payment(
    payload: schemas.RazorpayVerifyPaymentRequest, db: Session = Depends(get_db)
):
    client = get_razorpay_client()
    try:
        client.utility.verify_payment_signature(
            {
                "razorpay_order_id": payload.razorpay_order_id,
                "razorpay_payment_id": payload.razorpay_payment_id,
                "razorpay_signature": payload.razorpay_signature,
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail="Invalid Razorpay signature"
        ) from exc

    if payload.entity_type == "order":
        entity = (
            db.query(models.Order).filter(models.Order.id == payload.entity_id).first()
        )
        not_found = "Order not found"
    else:
        entity = (
            db.query(models.ServiceBooking)
            .filter(models.ServiceBooking.id == payload.entity_id)
            .first()
        )
        not_found = "Service booking not found"

    if not entity:
        raise HTTPException(status_code=404, detail=not_found)
    if entity.razorpay_order_id != payload.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Razorpay order ID mismatch")

    entity.razorpay_payment_id = payload.razorpay_payment_id
    entity.razorpay_signature = payload.razorpay_signature
    entity.payment_status = "captured"
    entity.status = models.OrderStatus.paid
    entity.paid_at = datetime.now(timezone.utc)
    db.commit()

    return schemas.RazorpayVerifyPaymentResponse(
        success=True,
        message="Payment verified and marked as paid",
    )


@router.post("/payments/webhook")
async def razorpay_webhook(request: Request, db: Session = Depends(get_db)):
    client = get_razorpay_client()
    webhook_secret = os.getenv("RAZORPAY_WEBHOOK_SECRET")
    if not webhook_secret:
        raise HTTPException(
            status_code=500,
            detail="Razorpay webhook is not configured. Set RAZORPAY_WEBHOOK_SECRET.",
        )

    body = await request.body()
    signature = request.headers.get("x-razorpay-signature")
    if not signature:
        raise HTTPException(status_code=400, detail="Missing webhook signature")

    try:
        client.utility.verify_webhook_signature(
            body.decode("utf-8"), signature, webhook_secret
        )
    except Exception as exc:
        raise HTTPException(
            status_code=400, detail="Invalid webhook signature"
        ) from exc

    payload = json.loads(body.decode("utf-8"))
    event = payload.get("event")
    payment_entity = payload.get("payload", {}).get("payment", {}).get("entity", {})
    razorpay_order_id = payment_entity.get("order_id")

    if event in {"payment.captured", "payment.failed"} and razorpay_order_id:
        order = (
            db.query(models.Order)
            .filter(models.Order.razorpay_order_id == razorpay_order_id)
            .first()
        )
        booking = None
        if not order:
            booking = (
                db.query(models.ServiceBooking)
                .filter(models.ServiceBooking.razorpay_order_id == razorpay_order_id)
                .first()
            )

        target = order or booking
        if target:
            target.razorpay_payment_id = payment_entity.get("id")
            target.payment_amount = (payment_entity.get("amount") or 0) / 100
            target.payment_currency = payment_entity.get("currency")

            if event == "payment.captured":
                target.payment_status = "captured"
                target.status = models.OrderStatus.paid
                target.paid_at = datetime.now(timezone.utc)
            else:
                target.payment_status = "failed"

            db.commit()

    return {"status": "ok"}


@router.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)


@router.get("/orders/", response_model=list[schemas.Order])
def read_orders(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.get_orders(db, skip=skip, limit=limit)


@router.patch("/orders/{order_id}/pay", response_model=schemas.Order)
def mark_order_as_paid(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_order_as_paid(db=db, order_id=order_id)


@router.patch("/orders/{order_id}/pending", response_model=schemas.Order)
def mark_order_as_pending(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_order_as_pending(db=db, order_id=order_id)


@router.patch("/orders/{order_id}/reject", response_model=schemas.Order)
def mark_order_as_rejected(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_order_as_rejected(db=db, order_id=order_id)


@router.patch("/orders/{order_id}/ship", response_model=schemas.Order)
def mark_order_as_shipped_or_delivered(
    order_id: int,
    status: schemas.OrderStatus,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.update_shipment_status(db=db, order_id=order_id, status=status)


# Service Booking Routes
@router.post("/service-bookings/", response_model=schemas.ServiceBooking)
def create_service_booking(
    booking: schemas.ServiceBookingCreate, db: Session = Depends(get_db)
):
    return crud.create_service_booking(db=db, booking=booking)


@router.get("/service-bookings/", response_model=list[schemas.ServiceBooking])
def read_service_bookings(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.get_service_bookings(db, skip=skip, limit=limit)


@router.patch(
    "/service-bookings/{booking_id}/pay", response_model=schemas.ServiceBooking
)
def mark_service_booking_as_paid(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_service_booking_as_paid(db=db, booking_id=booking_id)


@router.patch(
    "/service-bookings/{booking_id}/pending", response_model=schemas.ServiceBooking
)
def mark_service_booking_as_pending(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_service_booking_as_pending(db=db, booking_id=booking_id)


@router.patch(
    "/service-bookings/{booking_id}/reject", response_model=schemas.ServiceBooking
)
def mark_service_booking_as_rejected(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.mark_service_booking_as_rejected(db=db, booking_id=booking_id)


@router.delete("/service-bookings/{booking_id}")
def delete_service_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.delete_service_booking(db=db, booking_id=booking_id)


# Add these routes to your routes.py file for better order item management


@router.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Get a specific order by ID"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.patch("/orders/{order_id}/processing", response_model=schemas.Order)
def mark_order_as_processing(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Mark order as processing"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.processing
    db.commit()
    db.refresh(order)
    return order


@router.patch("/orders/{order_id}/delivered", response_model=schemas.Order)
def mark_order_as_delivered(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Mark order as delivered"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = schemas.OrderStatus.delivered
    db.commit()
    db.refresh(order)
    return order


@router.delete("/orders/{order_id}")
def delete_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.delete_order(db=db, order_id=order_id)


@router.get("/orders/{order_id}/items", response_model=list[schemas.OrderItem])
def get_order_items(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Get all items for a specific order"""
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order.items


@router.delete("/orders/{order_id}/items/{item_id}")
def delete_order_item(
    order_id: int,
    item_id: int,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    return crud.delete_order_item(db=db, order_id=order_id, item_id=item_id)


@router.get("/order-items/", response_model=list[dict])
def get_all_order_items(
    skip: int = 0,
    limit: int = 1000,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Get all order items with order information flattened"""
    orders = db.query(models.Order).offset(skip).limit(limit).all()

    flattened_items = []
    for order in orders:
        for item in order.items:
            flattened_items.append(
                {
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
                    "total_amount": order.total_amount,
                }
            )

    return flattened_items


@router.get("/orders/search/{search_term}", response_model=list[schemas.Order])
def search_orders(
    search_term: str,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Search orders by customer name, email, or phone"""
    search_pattern = f"%{search_term}%"
    return (
        db.query(models.Order)
        .filter(
            (models.Order.customer_name.ilike(search_pattern))
            | (models.Order.email.ilike(search_pattern))
            | (models.Order.phone.ilike(search_pattern))
        )
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/orders/status/{status}", response_model=list[schemas.Order])
def get_orders_by_status(
    status: schemas.OrderStatus,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Get orders filtered by status"""
    return (
        db.query(models.Order)
        .filter(models.Order.status == status)
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.get("/orders/stats/summary")
def get_order_statistics(
    db: Session = Depends(get_db),
    current_admin: models.AdminUser = Depends(get_current_admin),
):
    """Get statistics about orders"""
    total_orders = db.query(models.Order).count()
    pending_orders = (
        db.query(models.Order)
        .filter(models.Order.status == schemas.OrderStatus.pending)
        .count()
    )
    paid_orders = (
        db.query(models.Order)
        .filter(models.Order.status == schemas.OrderStatus.paid)
        .count()
    )
    processing_orders = (
        db.query(models.Order)
        .filter(models.Order.status == schemas.OrderStatus.processing)
        .count()
    )
    shipped_orders = (
        db.query(models.Order)
        .filter(models.Order.status == schemas.OrderStatus.shipped)
        .count()
    )
    delivered_orders = (
        db.query(models.Order)
        .filter(models.Order.status == schemas.OrderStatus.delivered)
        .count()
    )

    total_revenue = (
        db.query(db.func.sum(models.Order.total_amount))
        .filter(
            models.Order.status.in_(
                [
                    schemas.OrderStatus.paid,
                    schemas.OrderStatus.processing,
                    schemas.OrderStatus.shipped,
                    schemas.OrderStatus.delivered,
                ]
            )
        )
        .scalar()
        or 0
    )

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
        "total_items": total_items,
    }
