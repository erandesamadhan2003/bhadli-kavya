from fastapi import APIRouter, HTTPException
from .. import models
from .. import schemas

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/signup")
def signup(user: schemas.UserCreate):
    try:
        print(f"📝 Signup request: {user.email}, UID: {user.uid}, Provider: {user.auth_provider}")
        
        # Check if user already exists by email
        db_user = models.get_user_by_email(user.email)
        if db_user:
            print(f"✅ User already exists with email: {user.email}")
            return {
                "message": "User already exists",
                "user": {
                    "id": db_user["id"],
                    "email": db_user["email"],
                    "name": db_user["name"],
                    "uid": db_user["uid"],
                    "auth_provider": db_user["auth_provider"],
                    "photoURL": db_user["photoURL"]
                },
                "status": "existing"
            }
        
        # For users with UID (Firebase), also check by UID
        if user.uid:
            db_user_uid = models.get_user_by_uid(user.uid)
            if db_user_uid:
                print(f"✅ User already exists with UID: {user.uid}")
                return {
                    "message": "User already exists",
                    "user": {
                        "id": db_user_uid["id"],
                        "email": db_user_uid["email"],
                        "name": db_user_uid["name"],
                        "uid": db_user_uid["uid"],
                        "auth_provider": db_user_uid["auth_provider"],
                        "photoURL": db_user_uid["photoURL"]
                    },
                    "status": "existing"
                }
        
        # Create new user
        new_user = models.create_user(
            email=user.email,
            password=user.password,
            name=user.name,
            uid=user.uid,
            auth_provider=user.auth_provider,
            photoURL=user.photoURL
        )
        
        print(f"✅ User created successfully: {new_user['email']}")
        
        return {
            "message": "User created successfully",
            "user": new_user,
            "status": "created"
        }
        
    except ValueError as e:
        print(f"❌ Validation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"❌ Signup error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/login")
def login(user: schemas.UserLogin):
    try:
        print(f"🔐 Login request: {user.email}")
        
        db_user = models.get_user_by_email(user.email)
        if not db_user:
            print(f"❌ User not found: {user.email}")
            raise HTTPException(status_code=400, detail="Invalid credentials")
        
        if db_user["auth_provider"] == "email":
            if not models.verify_password(user.password, db_user["password"]):
                print(f"❌ Invalid password for: {user.email}")
                raise HTTPException(status_code=400, detail="Invalid credentials")
        
        # Update last login time
        if db_user.get("uid"):
            models.update_user_login_time(db_user["uid"])
        
        print(f"✅ Login successful: {user.email}")
        return {
            "message": "Login successful",
            "user": {
                "id": db_user["id"],
                "email": db_user["email"],
                "name": db_user["name"],
                "uid": db_user["uid"],
                "auth_provider": db_user["auth_provider"],
                "photoURL": db_user["photoURL"]
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Login error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/", response_model=list[schemas.UserOut])
def list_users():
    try:
        users = models.get_users()
        return users
    except Exception as e:
        print(f"❌ Error listing users: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
