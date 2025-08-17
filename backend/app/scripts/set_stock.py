# backend/app/scripts/set_stock.py
import argparse
from app.database import SessionLocal
from app.models import Product

def main():
    parser = argparse.ArgumentParser(description="Actualizar stock de productos")
    g = parser.add_mutually_exclusive_group(required=True)
    g.add_argument("--all", type=int, help="Pone este stock a TODOS los productos")
    g.add_argument("--id", type=int, help="ID de producto a actualizar")
    parser.add_argument("--stock", type=int, help="Cantidad de stock (junto con --id)")
    args = parser.parse_args()

    db = SessionLocal()
    try:
        if args.all is not None:
            n = db.query(Product).update({Product.stock: args.all})
            db.commit()
            print(f"OK: stock={args.all} para {n} productos")
        else:
            if args.stock is None:
                parser.error("--stock es requerido cuando usas --id")
            p = db.query(Product).filter_by(id=args.id).first()
            if not p:
                print(f"Producto id={args.id} no existe")
                return
            p.stock = args.stock
            db.commit()
            print(f"OK: id={p.id} → stock={p.stock}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
