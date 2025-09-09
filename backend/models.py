from .database import get_connection
from passlib.hash import bcrypt

def create_user(email: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()
    hashed_password = bcrypt.hash(password)
    cursor.execute("INSERT INTO users (email, password) VALUES (?, ?)", (email, hashed_password))
    conn.commit()
    user_id = cursor.lastrowid
    conn.close()
    return {"id": user_id, "email": email}

def get_user_by_email(email: str):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def get_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, email FROM users")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]
