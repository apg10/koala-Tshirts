# backend/app/scripts/seed_core_products.py
from pathlib import Path
import base64

from sqlalchemy.orm import Session
from .. import database, models

# PNG 1x1 transparente (para no depender de Pillow ni internet)
ONE_PIXEL_PNG_B64 = (
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Yk5c0wAAAAASUVORK5CYII="
)

STATIC_DIR = Path(__file__).resolve().parents[2] / "static" / "products"
STATIC_DIR.mkdir(parents=True, exist_ok=True)

def ensure_png(filename: str):
    """Crea un PNG 1x1 si no existe (para que el front siempre tenga imagen)."""
    path = STATIC_DIR / filename
    if not path.exists():
        path.write_bytes(base64.b64decode(ONE_PIXEL_PNG_B64))
    return f"/static/products/{filename}"

def upsert_category(db: Session, name: str) -> models.Category:
    cat = db.query(models.Category).filter_by(name=name).first()
    if not cat:
        cat = models.Category(name=name)
        db.add(cat)
        db.commit()
        db.refresh(cat)
    return cat

def upsert_product(
    db: Session, *, name: str, price: float, category_id: int,
    image_name: str, description: str = "", size: str = "M",
    color: str = "Black", stock: int = 50
):
    prod = db.query(models.Product).filter_by(name=name).first()
    if prod:
        # asegura campos clave actualizados
        prod.price = price
        prod.category_id = category_id
        prod.stock = stock
        if not prod.image:
            prod.image = ensure_png(image_name)
        db.commit()
        return prod

    prod = models.Product(
        name=name,
        description=description or f"{name} – high-quality cotton tee.",
        price=price,
        image=ensure_png(image_name),
        size=size,
        color=color,
        stock=stock,
        category_id=category_id,
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod

def main():
    db = database.SessionLocal()
    try:
        # 1) Categorías
        cat_long  = upsert_category(db, "Long Sleeve")
        cat_short = upsert_category(db, "Short Sleeve")
        cat_kids  = upsert_category(db, "Kids")

        # 2) Productos requeridos (precios oficiales)
        upsert_product(
            db,
            name="Long Sleeve T-Shirt",
            price=30.0,
            category_id=cat_long.id,
            image_name="koala_long.png",
        )
        upsert_product(
            db,
            name="Short Sleeve T-Shirt",
            price=25.0,
            category_id=cat_short.id,
            image_name="koala_short.png",
        )
        upsert_product(
            db,
            name="Kids T-Shirt",
            price=20.0,
            category_id=cat_kids.id,
            image_name="koala_kids.png",
        )

        print("✔ Seed complete: 3 products and categories are ready.")
        print(f"   Image folder: {STATIC_DIR}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
