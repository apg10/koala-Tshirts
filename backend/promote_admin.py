# backend/promote_admin.py

import sys
from app.database import SessionLocal
from app.models import User

def promote(email: str):
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    if not user:
        print(f"User not found: {email}")
        return
    user.is_admin = True
    db.commit()
    print(f"User {email} promoted to admin")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python promote_admin.py <email>")
    else:
        promote(sys.argv[1])
