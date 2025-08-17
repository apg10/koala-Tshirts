# backend/app/scripts/fix_stock_nulls.py
from app.database import engine

SQL = "UPDATE products SET stock = 0 WHERE stock IS NULL"

# begin() asegura COMMIT al salir del context
with engine.begin() as con:
    con.exec_driver_sql(SQL)
    print("Rows fixed to stock=0 where NULL.")
