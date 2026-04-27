from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="user") # "user" ou "admin"
    auth_provider = Column(String, default="email") # "email" ou "google"
    query_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
