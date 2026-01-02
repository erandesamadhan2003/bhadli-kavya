from fastapi import APIRouter, HTTPException
import models
import schemas
import auth  # Changed from relative to absolute import

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.post("/signup")
def signup(user: schemas.UserCreate):
    try:
        print(f"📝 Signup request: {user.email}, UID: {user.uid}, Provider: {user.auth_provider}, Location: {user.location}")
        
        # Check if user already exists by email
        db_user = models.get_user_by_email(user.email)
        if db_user:
            print(f"✅ User already exists with email: {user.email}")
            # ✅ Create JWT token for existing user
            access_token = auth.create_jwt(db_user["id"])
            
            return {
                "message": "User already exists",
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": db_user["id"],
                    "email": db_user["email"],
                    "name": db_user["name"],
                    "uid": db_user.get("uid"),
                    "auth_provider": db_user["auth_provider"],
                    "location": db_user.get("location")
                },
                "status": "existing"
            }
        
        # Create new user with location
        new_user = models.create_user(
            email=user.email,
            password=user.password,
            name=user.name,
            uid=user.uid,
            auth_provider=user.auth_provider,
            location=user.location if user.location else None
        )
        
        # ✅ Create JWT token for new user
        access_token = auth.create_jwt(new_user["id"])
        
        print(f"✅ User created successfully: {new_user['email']}")
        
        return {
            "message": "User created successfully",
            "access_token": access_token,
            "token_type": "bearer",
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
        
        # ✅ Create JWT token
        access_token = auth.create_jwt(db_user["id"])

        print(f"✅ Login successful: {user.email}")
        return {
            "message": "Login successful",
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user["id"],
                "email": db_user["email"],
                "name": db_user["name"],
                "uid": db_user.get("uid"),
                "auth_provider": db_user["auth_provider"],
                "location": db_user.get("location")
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
