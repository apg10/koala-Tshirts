from sqlalchemy.orm import Session
from app import models, database

# Inicializar la base de datos
models.Base.metadata.create_all(bind=database.engine)

# Crear una sesión
db: Session = database.SessionLocal()

# Limpiar tablas (opcional en desarrollo)
db.query(models.Product).delete()
db.query(models.Category).delete()
db.commit()

# Crear categorías
categories = [
    models.Category(name="T-Shirts"),
    models.Category(name="Hoodies"),
]

db.add_all(categories)
db.commit()

tshirts_category = db.query(models.Category).filter_by(name="T-Shirts").first()
hoodies_category = db.query(models.Category).filter_by(name="Hoodies").first()

assert tshirts_category is not None, "T-Shirts category not found"
assert hoodies_category is not None, "Hoodies category not found"

# Crear productos
products = [
    models.Product(
        name="Classic Koala Tee",
        description="Comfy cotton t-shirt with koala print.",
        price=29.99,
        image="/static/products/koala01.png",
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Street Koala Tee",
        description="Stylish streetwear koala t-shirt.",
        price=34.99,
        image="/static/products/koala02.png",
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Minimal Koala Tee",
        description="Simple and clean koala design.",
        price=24.99,
        image="/static/products/koala03.png",
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Koala Hoodie - Black",
        description="Warm hoodie with black koala print.",
        price=49.99,
        image="/static/products/hoodie0.png",
        category_id=hoodies_category.id,
    ),
    models.Product(
        name="Koala Hoodie - White",
        description="Clean white hoodie with koala patch.",
        price=52.99,
        image="/static/products/hoodie1.png",
        category_id=hoodies_category.id,
    ),
    models.Product(
        name="Limited Edition Hoodie",
        description="Premium limited edition koala hoodie.",
        price=64.99,
        image="/static/products/hoodie3.png",
        category_id=hoodies_category.id,
    ),
]

# Insertar productos
db.add_all(products)
db.commit()
db.close()
print("✅ Base de datos poblada con éxito.")
