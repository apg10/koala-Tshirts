# backend/app/scripts/migrate_add_stock.py
from app.database import engine

SQLS = [
    "ALTER TABLE products ADD COLUMN stock INTEGER",
    "UPDATE products SET stock = 0 WHERE stock IS NULL",
]

with engine.connect() as con:
    for sql in SQLS:
        try:
            con.exec_driver_sql(sql)
            print("OK:", sql)
        except Exception as e:
            # si ya existe, verás duplicate column -> ignorar
            print("Skip/Err:", sql, "->", e)
