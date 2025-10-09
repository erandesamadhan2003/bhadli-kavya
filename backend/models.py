from . import database
from passlib.hash import pbkdf2_sha256
from typing import Optional
import mysql.connector
import csv
from datetime import datetime

def create_user(email: str, password: str, name: Optional[str] = None, 
                uid: Optional[str] = None, auth_provider: str = "email", 
                photoURL: Optional[str] = None):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    
    # Hash password only for email auth, use as-is for OAuth
    if auth_provider == "email":
        hashed_password = pbkdf2_sha256.hash(password)
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
    return pbkdf2_sha256.verify(plain_password, hashed_password)


def update_user_login_time(uid: str):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE uid = %s",
        (uid,)
    )
    conn.close()
    
    
def insert_csv_into_calendar(file_path, calendar_type):
    conn = database.get_connection()
    cursor = conn.cursor()

    if calendar_type == "hindi":
        table_name = "hindi_calendar"
        date_col = "vikram_samvat_date"
    elif calendar_type == "gujarati":
        table_name = "gujarati_calendar"
        date_col = "gujarati_date"
    elif calendar_type == "bengali":
        table_name = "bengali_calendar"
        date_col = "bengali_date"
    else:
        raise ValueError("Invalid calendar type. Must be 'hindi', 'gujarati', or 'bengali'.")

    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            raw_date = row["gregorian_Date"].strip().strip('"')
            try:
                parsed_date = datetime.strptime(raw_date, "%d/%m/%Y").date()
            except ValueError:
                raise ValueError(f"Invalid date format: {raw_date}")

            cursor.execute(
                f"INSERT INTO {table_name} ({date_col}, gregorian_date) VALUES (%s, %s)",
                (row[date_col], parsed_date)
            )

    conn.commit()
    conn.close()
    print(f"✅ CSV data inserted successfully into {table_name} table")
    return {"message": f"Data uploaded to {table_name} successfully"}



def get_calendar_of_month(year: str, month: str, calendar_type: str = "hindi"):
    if calendar_type not in ["hindi", "gujarati", "bengali"]:
        raise ValueError("Invalid calendar type")

    table_name = f"{calendar_type}_calendar"
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    if calendar_type == "hindi":
        date_col = "vikram_samvat_date"
    elif calendar_type == "gujarati":
        date_col = "gujarati_date"
    else:
        date_col = "bengali_date"

    search_pattern = f"%{month}%{year}%"

    cursor.execute(f"""
        SELECT {date_col} AS vikram_samvat_date, gregorian_date
        FROM {table_name}
        WHERE {date_col} LIKE %s
        ORDER BY id ASC
    """, (search_pattern,))

    result = cursor.fetchall()
    conn.close()

    return result
