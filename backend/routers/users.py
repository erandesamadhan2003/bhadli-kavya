from fastapi import APIRouter, HTTPException
from .. import models, schemas

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/signup", response_model=schemas.UserOut)
def signup(user: schemas.UserCreate):
    db_user = models.get_user_by_email(user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return models.create_user(user.email, user.password)

@router.get("/", response_model=list[schemas.UserOut])
def list_users():
    return models.get_users()
