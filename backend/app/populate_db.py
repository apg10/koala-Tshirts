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

<<<<<<< HEAD
=======
tshirts_category = db.query(models.Category).filter_by(name="T-Shirts").first()
hoodies_category = db.query(models.Category).filter_by(name="Hoodies").first()

assert tshirts_category is not None, "T-Shirts category not found"
assert hoodies_category is not None, "Hoodies category not found"


>>>>>>> origin/main
# Obtener categorías con ID
tshirts_category = db.query(models.Category).filter_by(name="T-Shirts").first()
hoodies_category = db.query(models.Category).filter_by(name="Hoodies").first()

# Crear productos
products = [
    models.Product(
        name="Classic Koala Tee",
        description="Comfy cotton t-shirt with koala print.",
        price=29.99,
<<<<<<< HEAD
        image="/static/products/koala01.png",
=======
        image="https://example.com/koala1.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Street Koala Tee",
        description="Stylish streetwear koala t-shirt.",
        price=34.99,
<<<<<<< HEAD
        image="/static/products/koala02.png",
=======
        image="https://example.com/koala2.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Minimal Koala Tee",
        description="Simple and clean koala design.",
        price=24.99,
<<<<<<< HEAD
        image="/static/products/koala03.png",
=======
        image="https://example.com/koala3.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=tshirts_category.id,
    ),
    models.Product(
        name="Koala Hoodie - Black",
        description="Warm hoodie with black koala print.",
        price=49.99,
<<<<<<< HEAD
        image="/static/products/hoodie0.png",
=======
        image="https://example.com/hoodie1.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=hoodies_category.id,
    ),
    models.Product(
        name="Koala Hoodie - White",
        description="Clean white hoodie with koala patch.",
        price=52.99,
<<<<<<< HEAD
        image="/static/products/hoodie1.png",
=======
        image="https://example.com/hoodie2.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=hoodies_category.id,
    ),
    models.Product(
        name="Limited Edition Hoodie",
        description="Premium limited edition koala hoodie.",
        price=64.99,
<<<<<<< HEAD
        image="/static/products/hoodie3.png",
=======
        image="https://example.com/hoodie3.jpg",
>>>>>>> origin/main
        width=500,
        height=500,
        category_id=hoodies_category.id,
    ),
]

# Insertar productos
db.add_all(products)
db.commit()
<<<<<<< HEAD
db.close()

=======

db.close()
>>>>>>> origin/main
print("✅ Base de datos poblada con éxito.")
