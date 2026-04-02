from pydantic import BaseModel, EmailStr
from typing import Optional, List, Union, Literal

from datetime import datetime
from enum import Enum


class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    processing = "processing"
    shipped = "shipped"
    delivered = "delivered"
    rejected = "rejected"


class OrderItemBase(BaseModel):
    crystal: str
    form: str
    quantity: int
    unit_price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    total_amount: float
    status: OrderStatus = OrderStatus.pending


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]


class Order(OrderBase):
    id: int
    created_at: Optional[datetime]
    items: List[OrderItem] = []
    payment_status: Optional[str] = None
    payment_amount: Optional[float] = None
    payment_currency: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ServiceSessionBase(BaseModel):
    id: str
    name: str
    duration: str
    price: Union[int, float, str]  # Allowing multiple types as per your interface
    description: str


class ServiceSessionCreate(ServiceSessionBase):
    pass


class ServiceSession(ServiceSessionBase):
    service_id: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ServiceBase(BaseModel):
    id: str
    name: str
    description: str
    basePrice: str  # Using camelCase to match your interface
    duration: Optional[str] = None
    type: str


class ServiceCreate(ServiceBase):
    sessions: List[ServiceSessionCreate]


class Service(ServiceBase):
    created_at: Optional[datetime] = None
    sessions: List[ServiceSession] = []

    class Config:
        from_attributes = True


# Service Booking Schemas
class ServiceBookingItemBase(BaseModel):
    service_name: str
    session_name: str
    quantity: int
    unit_price: float


class ServiceBookingItemCreate(ServiceBookingItemBase):
    pass


class ServiceBookingItem(ServiceBookingItemBase):
    id: int

    class Config:
        from_attributes = True


class ServiceBookingBase(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    total_amount: float
    status: OrderStatus = OrderStatus.pending


class ServiceBookingCreate(ServiceBookingBase):
    items: List[ServiceBookingItemCreate]


class ServiceBooking(ServiceBookingBase):
    id: int
    created_at: Optional[datetime]
    items: List[ServiceBookingItem] = []
    payment_status: Optional[str] = None
    payment_amount: Optional[float] = None
    payment_currency: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class RazorpayCreateOrderResponse(BaseModel):
    key_id: str
    razorpay_order_id: str
    amount: int
    currency: str
    entity_type: Literal["order", "service_booking"]
    entity_id: int


class RazorpayVerifyPaymentRequest(BaseModel):
    entity_type: Literal["order", "service_booking"]
    entity_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class RazorpayVerifyPaymentResponse(BaseModel):
    success: bool
    message: str


class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str


class AdminUserResponse(BaseModel):
    id: int
    email: EmailStr

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    success: bool
    message: str
    user: Optional[AdminUserResponse] = None
