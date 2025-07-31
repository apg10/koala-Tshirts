# tests/test_crud.py

from app import crud, schemas
from sqlalchemy.orm import Session

def test_create_and_get_product(db_session: Session):
    # Preparar datos de producto
    product_in = schemas.ProductCreate(
        name="Test Product",
        description="Descripción de prueba",
        price=9.99,
        category_id=None
    )
    # Crear producto
    product = crud.create_product(db_session, product_in)
    assert product.id is not None
    # Obtener producto
    fetched = crud.get_product(db_session, product.id)
    assert fetched.name == product_in.name
    assert fetched.price == product_in.price
