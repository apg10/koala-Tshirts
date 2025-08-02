# backend/seed_categories.py
from app import models, database

CATEGORIES = [
    (1, "Short Sleeve T-Shirts"),
    (2, "Long Sleeve T-Shirts"),
    (3, "Extra-Large T-Shirts"),
    (4, "Kids T-Shirts"),
    (5, "Extra-Small T-Shirts"),
]

def main():
    db = database.SessionLocal()
    for cid, name in CATEGORIES:
        if not db.query(models.Category).filter_by(id=cid).first():
            db.add(models.Category(id=cid, name=name))
    db.commit()
    print("✔  Categories seeded.")

if __name__ == "__main__":
    main()
