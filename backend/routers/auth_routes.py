from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from datetime import datetime, timedelta
import jwt
import models, auth

router = APIRouter(prefix="/api/auth", tags=["auth"])

GOOGLE_CLIENT_ID = "460140873905-q11gn9dkgaa26j20sj5kpk5aeulhb0tu.apps.googleusercontent.com"
JWT_SECRET = "bhadlikavyasecretkey"
ALGO = "HS256"


class GoogleAuthRequest(BaseModel):
    token: str


@router.post("/google/callback")
def google_login(request: GoogleAuthRequest):
    try:
        payload = id_token.verify_oauth2_token(
            request.token, requests.Request(), GOOGLE_CLIENT_ID
        )
    except:
        raise HTTPException(status_code=401, detail="Invalid Google token")

    google_id = payload["sub"]
    email = payload.get("email")
    name = payload.get("name")
    picture = payload.get("picture")

    user = models.get_user_by_google_id(google_id)

    if not user:
        user = models.create_google_user(google_id, email, name, picture)

    jwt_token = auth.create_jwt(user["id"])

    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me")
def get_profile(user_id: int = Depends(auth.get_current_user_id)):
    user = models.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
