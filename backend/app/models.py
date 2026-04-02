from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Enum,
    DateTime,
    ForeignKey,
    Text,
    Boolean,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base
import enum


class OrderStatus(enum.Enum):
    pending = "pending"
    paid = "paid"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    rejected = "rejected"


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(32), nullable=False)
    address = Column(String(500), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    payment_status = Column(String(50), nullable=False, default="pending")
    payment_amount = Column(Float, nullable=True)
    payment_currency = Column(String(10), nullable=True)
    razorpay_order_id = Column(String(120), unique=True, nullable=True, index=True)
    razorpay_payment_id = Column(String(120), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship(
        "OrderItem", back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    crystal = Column(String(120), nullable=False)
    form = Column(String(80), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")


# New Service Models
class Service(Base):
    __tablename__ = "services"

    id = Column(
        String(64), primary_key=True, index=True
    )  # Using String to match your interface
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    base_price = Column(
        String(50), nullable=False
    )  # Keeping as String to match your interface
    duration = Column(String(80), nullable=True)
    type = Column(String(80), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    sessions = relationship(
        "ServiceSession", back_populates="service", cascade="all, delete-orphan"
    )


class ServiceSession(Base):
    __tablename__ = "service_sessions"

    id = Column(
        String(64), primary_key=True, index=True
    )  # Using String to match your interface
    service_id = Column(String(64), ForeignKey("services.id"), nullable=False)
    name = Column(String(255), nullable=False)
    duration = Column(String(80), nullable=False)
    price = Column(
        String(50), nullable=False
    )  # Using String to handle both number and string types
    description = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    service = relationship("Service", back_populates="sessions")


# Service Booking Models
class ServiceBooking(Base):
    __tablename__ = "service_bookings"

    id = Column(Integer, primary_key=True, index=True)
    customer_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(32), nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(Enum(OrderStatus), default=OrderStatus.pending)
    payment_status = Column(String(50), nullable=False, default="pending")
    payment_amount = Column(Float, nullable=True)
    payment_currency = Column(String(10), nullable=True)
    razorpay_order_id = Column(String(120), unique=True, nullable=True, index=True)
    razorpay_payment_id = Column(String(120), nullable=True)
    razorpay_signature = Column(String(255), nullable=True)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship(
        "ServiceBookingItem", back_populates="booking", cascade="all, delete-orphan"
    )


class ServiceBookingItem(Base):
    __tablename__ = "service_booking_items"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("service_bookings.id"), nullable=False)
    service_name = Column(String(255), nullable=False)
    session_name = Column(String(255), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    booking = relationship("ServiceBooking", back_populates="items")


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
