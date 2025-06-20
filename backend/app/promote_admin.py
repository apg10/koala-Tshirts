from app.database import SessionLocal
from app import models

EMAIL = "adrianlive1024@gmail.com"          # ← pon tu correo aquí

db = SessionLocal()
user = db.query(models.User).filter_by(email=EMAIL).first()
if user:
    user.is_admin = True
    db.commit()
    print(f"{EMAIL} ahora es admin ✅")
else:
    print("Usuario no encontrado ❌")
db.close()
