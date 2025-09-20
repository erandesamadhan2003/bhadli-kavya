import database
from passlib.hash import bcrypt
from typing import Optional

def create_user(email: str, password: str, name: Optional[str] = None, 
                uid: Optional[str] = None, auth_provider: str = "email", 
                photoURL: Optional[str] = None):
    conn = database.get_connection()
    cursor = conn.cursor()
    
    # Hash password only for email auth, use as-is for OAuth
    if auth_provider == "email":
        hashed_password = bcrypt.hash(password)
    else:
        hashed_password = password  # For OAuth, store as provided
    
    try:
        cursor.execute("""
            INSERT INTO users (email, password, name, uid, auth_provider, photoURL) 
            VALUES (?, ?, ?, ?, ?, ?)
        """, (email, hashed_password, name, uid, auth_provider, photoURL))
        
        conn.commit()
        user_id = cursor.lastrowid
        
        # Return the created user
        cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
        user = cursor.fetchone()
        conn.close()
        
        return {
            "id": user[0],
            "email": user[1], 
            "name": user[3], 
            "uid": user[4],
            "auth_provider": user[5],
            "photoURL": user[6]
        }
    except Exception as e:
        conn.close()
        raise e

def get_user_by_email(email: str):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            "id": user[0],
            "email": user[1],
            "password": user[2],
            "name": user[3],
            "uid": user[4],
            "auth_provider": user[5],
            "photoURL": user[6],
            "created_at": user[7]
        }
    return None

def get_user_by_uid(uid: str):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE uid = ?", (uid,))
    user = cursor.fetchone()
    conn.close()
    
    if user:
        return {
            "id": user[0],
            "email": user[1],
            "password": user[2],
            "name": user[3],
            "uid": user[4],
            "auth_provider": user[5],
            "photoURL": user[6],
            "created_at": user[7]
        }
    return None

def get_users():
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email, name, uid, auth_provider, photoURL, created_at FROM users")
    users = cursor.fetchall()
    conn.close()
    
    return [{
        "id": user[0],
        "email": user[1],
        "name": user[2],
        "uid": user[3],
        "auth_provider": user[4],
        "photoURL": user[5],
        "created_at": user[6]
    } for user in users]

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)
