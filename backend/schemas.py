from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    email: str  # Changed from EmailStr to str
    password: str
    name: Optional[str] = None
    uid: Optional[str] = None
    auth_provider: str = "email"
    photoURL: Optional[str] = None
    location: Optional[str]
    calendar_preference: Optional[str]

class UserOut(BaseModel):
    id: int
    email: str
    name: Optional[str]
    uid: Optional[str]
    auth_provider: str
    photoURL: Optional[str]
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str  # Changed from EmailStr to str
    password: str
