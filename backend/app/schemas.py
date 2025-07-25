from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum

class OrderStatus(str, Enum):
    pending = "pending"
    paid = "paid"
    shipped = "shipped"
    delivered = "delivered"

class OrderBase(BaseModel):
    customer_name: str
    email: EmailStr
    phone: str
    address: str
    crystal: str
    form: str
    total_amount: float
    status: OrderStatus = OrderStatus.pending

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    created_at: Optional[datetime]

    class Config:
        orm_mode = True
