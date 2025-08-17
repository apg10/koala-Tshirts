from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from .database import Base

class Category(Base):
    __tablename__ = "categories"
    id   = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String, index=True)
    description = Column(String)
    price       = Column(Float)
    image       = Column(String)
    size        = Column(String)        # opcional en DB
    color       = Column(String)        # opcional en DB
    stock       = Column(Integer, nullable=False, default=0)
    category_id = Column(Integer, ForeignKey("categories.id"))
    category    = relationship("Category", back_populates="products")

class User(Base):
    __tablename__ = "users"
    id              = Column(Integer, primary_key=True, index=True)
    email           = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin        = Column(Boolean, default=False)

class Cart(Base):
    __tablename__ = "carts"
    id        = Column(Integer, primary_key=True, index=True)
    user_id   = Column(Integer, ForeignKey("users.id"), unique=True)
    created   = Column(DateTime(timezone=True), server_default=func.now())
    status    = Column(String, default="active")
    user      = relationship("User", back_populates="cart", uselist=False)
    items     = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

User.cart = relationship("Cart", back_populates="user", uselist=False)

class CartItem(Base):
    __tablename__ = "cart_items"
    id         = Column(Integer, primary_key=True, index=True)
    cart_id    = Column(Integer, ForeignKey("carts.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    qty        = Column(Integer, default=1)
    cart      = relationship("Cart", back_populates="items")
    product   = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    id        = Column(Integer, primary_key=True, index=True)
    user_id   = Column(Integer, ForeignKey("users.id"))
    created   = Column(DateTime(timezone=True), server_default=func.now())
    total     = Column(Float, default=0.0)
    status    = Column(String, default="pending")
    guest          = Column(Boolean, default=False)
    shipping_name  = Column(String, nullable=True)
    shipping_email = Column(String, nullable=True)
    shipping_addr  = Column(String, nullable=True)
    stripe_pi_id   = Column(String, nullable=True)   # id de PaymentIntent (si lo usas)
    stripe_status  = Column(String, nullable=True)

    user   = relationship("User", back_populates="orders")
    items  = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

# relación inversa para listar órdenes del usuario
User.orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id         = Column(Integer, primary_key=True, index=True)
    order_id   = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    qty        = Column(Integer)
    price      = Column(Float)
    order      = relationship("Order", back_populates="items")
    product    = relationship("Product")
