from sqlalchemy import (
    Column, Integer, String, Float,
    ForeignKey, Boolean
)
from sqlalchemy.orm import relationship
from .database import Base

# ───────── Category ─────────
class Category(Base):
    __tablename__ = "categories"

    id   = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    products = relationship("Product", back_populates="category")


# ───────── Product ─────────
class Product(Base):
    __tablename__ = "products"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, index=True)
    description = Column(String)
    price       = Column(Float)
    image       = Column(String)
    width       = Column(Integer)
    height      = Column(Integer)

    category_id = Column(Integer, ForeignKey("categories.id"))
    category    = relationship("Category", back_populates="products")


# ───────── User ─────────
class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin        = Column(Boolean, default=False)
