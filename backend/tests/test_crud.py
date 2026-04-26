# tests/test_crud.py

from app import crud, schemas
from sqlalchemy.orm import Session

def test_create_and_get_product(db_session: Session):
    # Crear categoría primero
    category_in = schemas.CategoryCreate(
        name="Test Category"
    )
    category = crud.create_category(db_session, category_in)

    # Preparar datos de producto
    product_in = schemas.ProductCreate(
        name="Test Product",
        description="Descripción de prueba",
        price=9.99,
        image="test_image.jpg",
        category_id=category.id
    )
    # Crear producto
    product = crud.create_product(db_session, product_in)
    assert product.id is not None
    # Obtener producto
    fetched = crud.get_product(db_session, product.id)
    assert fetched.name == product_in.name
    assert fetched.price == product_in.price
