import database
from passlib.hash import bcrypt
from typing import Optional
import mysql.connector

def create_user(email: str, password: str, name: Optional[str] = None, 
                uid: Optional[str] = None, auth_provider: str = "email", 
                photoURL: Optional[str] = None):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Hash password only for email auth, use as-is for OAuth
    if auth_provider == "email":
        hashed_password = bcrypt.hash(password)
    else:
        hashed_password = password  # For OAuth, store as provided
    
    try:
        cursor.execute("""
            INSERT INTO users (email, password, name, uid, auth_provider, photoURL) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (email, hashed_password, name, uid, auth_provider, photoURL))
        
        user_id = cursor.lastrowid
        
        # Return the created user
        cursor.execute("SELECT id, email, name, uid, auth_provider, photoURL, created_at FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        return {
            "id": user["id"],
            "email": user["email"], 
            "name": user["name"], 
            "uid": user["uid"],
            "auth_provider": user["auth_provider"],
            "photoURL": user["photoURL"],
            "created_at": user["created_at"]
        }
    except mysql.connector.IntegrityError as e:
        conn.close()
        if "email" in str(e):
            raise ValueError("Email already registered")
        elif "uid" in str(e):
            raise ValueError("UID already exists")
        else:
            raise ValueError("User creation failed")
    except Exception as e:
        conn.close()
        raise e

def get_user_by_email(email: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    conn.close()
    
    return user

def get_user_by_uid(uid: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE uid = %s", (uid,))
    user = cursor.fetchone()
    conn.close()
    
    return user

def get_users():
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, email, name, uid, auth_provider, photoURL, created_at FROM users")
    users = cursor.fetchall()
    conn.close()
    
    return users

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)

def update_user_login_time(uid: str):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE uid = %s",
        (uid,)
    )
    conn.close()
