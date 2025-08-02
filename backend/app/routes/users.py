# backend/app/routes/users.py

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from .. import schemas, models, database
from ..auth import hash_password, verify_password, create_access_token

router = APIRouter(prefix="", tags=["Auth / Users"])


# ───────── Registration ─────────

@router.post("/users/", response_model=schemas.UserOut)
def create_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(database.get_db)
):
    if db.query(models.User).filter(models.User.email == user_in.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=user_in.email,
        hashed_password=hash_password(user_in.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ───────── Login ─────────

@router.post("/login", response_model=schemas.Token)
def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(database.get_db)
):
    user = (
        db.query(models.User)
        .filter(models.User.email == form.username)
        .first()
    )
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect credentials")

    # Include is_admin in payload and response
    token_data = {"user_id": user.id, "is_admin": user.is_admin}
    token = create_access_token(data=token_data)

    return {
        "access_token": token,
        "token_type": "bearer",
        "is_admin": user.is_admin,
    }
