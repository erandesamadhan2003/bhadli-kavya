from fastapi import HTTPException, Header
import jwt

JWT_SECRET = "YOUR_JWT_SECRET"
ALGO = "HS256"

def create_jwt(user_id: int):
    payload = {"sub": str(user_id)}
    return jwt.encode(payload, JWT_SECRET, algorithm=ALGO)


def get_current_user_id(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split("Bearer ")[1]

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGO])
        return int(payload["sub"])
    except:
        raise HTTPException(status_code=401, detail="Invalid token")
