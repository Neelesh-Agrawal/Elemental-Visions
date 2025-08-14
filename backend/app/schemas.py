from pydantic import BaseModel, EmailStr
from typing import Optional, List
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
        orm_mode = True

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

    class Config:
        orm_mode = True

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
        orm_mode = True

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
        orm_mode = True

