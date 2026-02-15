import database
from passlib.hash import pbkdf2_sha256
from typing import Optional
import mysql.connector
import csv
from datetime import datetime
import uuid
import calendar as cal

def create_user(
    email: str,
    password: str,
    name: Optional[str] = None,
    uid: Optional[str] = None,
    auth_provider: str = "email",
    location: Optional[str] = None,
    calendar_preference: str = "gregorian"
):
    """Create a new user with optional location and calendar preference"""
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    if auth_provider == "email":
        hashed_password = pbkdf2_sha256.hash(password)
    else:
        hashed_password = password

    try:
        cursor.execute("""
            INSERT INTO users (
                email,
                password,
                name,
                uid,
                auth_provider,
                location,
                calendar_preference
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            email,
            hashed_password,
            name,
            uid,
            auth_provider,
            location,
            calendar_preference
        ))

        user_id = cursor.lastrowid

        cursor.execute("""
            SELECT
                id,
                email,
                name,
                uid,
                auth_provider,
                location,
                calendar_preference,
                created_at
            FROM users
            WHERE id = %s
        """, (user_id,))

        user = cursor.fetchone()
        conn.close()

        return user

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
    cursor.execute("SELECT id, email, name, uid, auth_provider, created_at FROM users")
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
                parsed_date = datetime.strptime(raw_date, "%b %d, %Y").date()
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



def get_calendar_of_month(year: str, month: str, calendar: str = "gregorian"):
    """
    Fetch the mapping of Gregorian <-> Regional calendars for a given month.
    """
    valid_calendars = ["gregorian", "vikram_samvat", "rajasthan", "gujarat", "bengal"]
    if calendar not in valid_calendars:
        raise ValueError(f"Invalid calendar type. Must be one of: {', '.join(valid_calendars)}")

    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    # Build pattern (e.g., "%March%2025%")
    search_pattern = f"%{month}%{year}%"

    cursor.execute("""
        SELECT vikram_samvat_date, gregorian_date, calendar_type
        FROM calendar
        WHERE calendar_type = %s
        AND gregorian_date LIKE %s
        ORDER BY id ASC
    """, (calendar, search_pattern))

    results = cursor.fetchall()
    conn.close()
    return results


def get_calendar_for_user_preference(user_id: int = None, location: str = None):
    """
    Determine user's preferred calendar type based on location or stored preference.
    (For simplicity, we’ll use basic mapping.)
    """
    region_to_calendar = {
        "uttar_pradesh": "vikram_samvat",
        "rajasthan": "rajasthan",
        "gujarat": "gujarat",
        "west_bengal": "bengal"
    }

    # Default to Gregorian if location is not provided or unknown
    if not location:
        calendar_type = "gregorian"
    else:
        calendar_type = region_to_calendar.get(location.lower(), "gregorian")

    # Get current Gregorian month and year
    today = datetime.now()
    month_name = today.strftime("%B")  # e.g., "December"
    year = today.year

    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    search_pattern = f"%{month_name}%{year}%"

    cursor.execute("""
        SELECT vikram_samvat_date, gregorian_date, calendar_type
        FROM calendar
        WHERE calendar_type = %s
        AND gregorian_date LIKE %s
        ORDER BY id ASC
    """, (calendar_type, search_pattern))

    results = cursor.fetchall()
    conn.close()

    return {
        "calendar_type": calendar_type,
        "gregorian_month": f"{month_name} {year}",
        "dates": results,
        "total_days": len(results)
    }


def save_message(user_id: int, role: str, content: str, session_id: str = None):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    import uuid
    message_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO messages (message_id, user_id, role, content, session_id)
        VALUES (%s, %s, %s, %s, %s)
    """, (message_id, user_id, role, content, session_id))
    conn.commit()

    cursor.execute("SELECT * FROM messages WHERE message_id = %s", (message_id,))
    message = cursor.fetchone()
    conn.close()
    return message


def get_last_messages(user_id: int, limit: int = 2):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT role, content FROM messages
        WHERE user_id = %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (user_id, limit))
    messages = cursor.fetchall()
    conn.close()
    return list(reversed(messages))


def get_messages(user_id: int, limit: int, before: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    if before:
        cursor.execute("""
            SELECT * FROM messages
            WHERE user_id = %s AND created_at < %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, before, limit))
    else:
        cursor.execute("""
            SELECT * FROM messages
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, limit))

    messages = cursor.fetchall()
    conn.close()
    return messages


def delete_message(message_id: str, user_id: int):
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM messages
        WHERE message_id = %s AND user_id = %s
    """, (message_id, user_id))

    affected_rows = cursor.rowcount
    conn.commit()
    conn.close()

    return affected_rows > 0


def get_user_by_google_id(google_id: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE google_id = %s", (google_id,))
    user = cursor.fetchone()
    conn.close()
    return user


def create_google_user(google_id: str, email: str, name: str, photoURL: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        INSERT INTO users (email, password, name, google_id, auth_provider, photoURL)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (email, "", name, google_id, "google", photoURL))

    conn.commit()

    cursor.execute("SELECT id, email, name, uid, auth_provider, photoURL FROM users WHERE uid = %s", (google_id,))
    user = cursor.fetchone()
    conn.close()
    return user


################## User session management functions ##################

# Create a new session
def create_session(user_id: int, title: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    session_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO sessions (session_id, user_id, title, status)
        VALUES (%s, %s, %s, 'active')
    """, (session_id, user_id, title))
    conn.commit()

    cursor.execute("SELECT * FROM sessions WHERE session_id = %s", (session_id,))
    session = cursor.fetchone()
    conn.close()
    return session


# Get all sessions for a user
def get_sessions_by_user(user_id: int):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT session_id, title, status, started_at, ended_at
        FROM sessions
        WHERE user_id = %s
        ORDER BY started_at DESC
    """, (user_id,))
    sessions = cursor.fetchall()
    conn.close()
    return sessions


# End a session
def end_session(session_id: str, user_id: int):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE sessions
        SET status = 'ended', ended_at = %s
        WHERE session_id = %s AND user_id = %s
    """, (datetime.now(), session_id, user_id))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0


# Get session by ID
def get_session_by_id(session_id: str, user_id: int):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT session_id, title, status, started_at, ended_at
        FROM sessions
        WHERE session_id = %s AND user_id = %s
    """, (session_id, user_id))
    session = cursor.fetchone()
    conn.close()
    return session



################## POEM MANAGEMENT ##################


# 1️⃣ Create a new poem
def create_poem(poem: str, language: str, season: str, location: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    poem_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO poems (poem_id, poem, language, season, location)
        VALUES (%s, %s, %s, %s, %s)
    """, (poem_id, poem, language, season, location))

    conn.commit()

    cursor.execute("SELECT * FROM poems WHERE poem_id = %s", (poem_id,))
    poem_row = cursor.fetchone()
    conn.close()

    return poem_row


# 2️⃣ Get all poems (with optional filters)
def get_poems(language: str = None, season: str = None, location: str = None):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM poems WHERE 1=1"
    params = []

    if language:
        query += " AND language = %s"
        params.append(language)
    if season:
        query += " AND season = %s"
        params.append(season)
    if location:
        query += " AND location = %s"
        params.append(location)

    query += " ORDER BY created_at DESC"
    cursor.execute(query, tuple(params))
    poems = cursor.fetchall()
    conn.close()

    return poems


# 3️⃣ Get a single poem by ID
def get_poem_by_id(poem_id: str):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM poems WHERE poem_id = %s", (poem_id,))
    poem = cursor.fetchone()
    conn.close()
    return poem


# 4️⃣ Delete a poem
def delete_poem(poem_id: str):
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM poems WHERE poem_id = %s", (poem_id,))
    affected_rows = cursor.rowcount
    conn.commit()
    conn.close()
    return affected_rows > 0

################## ADDITIONAL POEM FILTERS & ANALYTICS ##################

# 5.1 Get poems by language
def get_poems_by_language(language: str, limit: int = 5, before: str = None):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    query = """
        SELECT poem_id, poem, language, season, location, created_at
        FROM poems
        WHERE language = %s
    """
    params = [language]

    if before:
        query += " AND created_at < %s"
        params.append(before)

    query += " ORDER BY created_at DESC LIMIT %s"
    params.append(limit)

    cursor.execute(query, tuple(params))
    poems = cursor.fetchall()
    conn.close()
    return poems


# 5.2 Get poems by season patterns (supports multiple season names)
def get_poems_by_season_patterns(season_patterns: list, limit: int = 5):
    """
    Get poems by season using pattern matching.
    Searches for any of the provided season patterns in the season column.
    """
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    # Build WHERE clause with OR conditions for pattern matching
    conditions = []
    params = []
    
    for pattern in season_patterns:
        conditions.append("season LIKE %s")
        params.append(f"%{pattern}%")
    
    where_clause = " OR ".join(conditions)
    params.append(limit)

    query = f"""
        SELECT poem_id, poem, language, season, location, created_at
        FROM poems
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT %s
    """

    cursor.execute(query, tuple(params))
    poems = cursor.fetchall()
    conn.close()
    return poems

# Keep the old function for backward compatibility
def get_poems_by_season(season: str, limit: int = 5):
    return get_poems_by_season_patterns([season], limit)


# 5.3 Get poems by location
def get_poems_by_location(location: str, limit: int = 5):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT poem_id, poem, language, season, location, created_at
        FROM poems
        WHERE location = %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (location, limit))

    poems = cursor.fetchall()
    conn.close()
    return poems


# 5.4 Get poem counts grouped by season
def get_poem_counts_by_season():
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT season, COUNT(*) AS poem_count
        FROM poems
        GROUP BY season
        ORDER BY poem_count DESC
    """)

    counts = cursor.fetchall()
    conn.close()
    return counts




def insert_calendar_row(row: dict):
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT IGNORE INTO calendar(
            gregorian_date,
            day,
            hindi_date,
            gujarati_date,
            bengali_date,
            rajasthani_date
        )
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (
        row.get("gregorian_date"),
        row.get("day"),
        row.get("Hindi_Date") or None,
        row.get("Gujarati_Date") or None,
        row.get("Bengali_Date") or None,
        row.get("Rajasthani_Date") or None
    ))

    conn.commit()
    conn.close()
    
    
###################### CALENDAR FETCHING ###################### 

def get_calendar_month(year: int, month: int, calendar: str):
    calendar_column_map = {
        "gregorian": "gregorian_date",
        "hindi": "hindi_date",
        "gujarati": "gujarati_date",
        "bengali": "bengali_date",
        "rajasthani": "rajasthani_date"
    }

    if calendar not in calendar_column_map:
        raise ValueError("Invalid calendar type")

    calendar_column = calendar_column_map[calendar]

    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            gregorian_date,
            day,
            hindi_date,
            gujarati_date,
            bengali_date,
            rajasthani_date
        FROM calendar
        WHERE YEAR(gregorian_date) = %s
          AND MONTH(gregorian_date) = %s
        ORDER BY gregorian_date ASC
    """, (year, month))

    rows = cursor.fetchall()
    conn.close()

    dates = []
    for r in rows:
        dates.append({
            "gregorian_date": r["gregorian_date"],
            "day": r["day"],
            "regional_date": r[calendar_column]
        })

    return {
        "calendar": calendar,
        "year": year,
        "month": month,
        "total_days": len(dates),
        "dates": dates
    }



def get_calendar_for_user(user_id: int):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
        SELECT location, calendar_preference
        FROM users
        WHERE id = %s
    """, (user_id,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        raise ValueError("User not found")

    location = user.get("location")
    calendar_pref = user.get("calendar_preference")

    calendar_map = {
        "hindi": "hindi_date",
        "gujarati": "gujarati_date",
        "bengali": "bengali_date",
        "rajasthani": "rajasthani_date",
        "gregorian": "gregorian_date"
    }

    calendar_column = calendar_map.get(
        calendar_pref.lower() if calendar_pref else None
    )

    if not calendar_column:
        region_map = {
            "uttar pradesh": "hindi_date",
            "gujarat": "gujarati_date",
            "rajasthan": "rajasthani_date",
            "west bengal": "bengali_date"
        }

        calendar_column = region_map.get(
            location.lower() if location else "",
            "gregorian_date"
        )

    today = datetime.now()
    year = today.year
    month = today.month

    cursor.execute(f"""
        SELECT
            gregorian_date,
            day,
            {calendar_column} AS regional_date
        FROM calendar
        WHERE YEAR(gregorian_date) = %s
          AND MONTH(gregorian_date) = %s
        ORDER BY gregorian_date ASC
    """, (year, month))

    rows = cursor.fetchall()
    conn.close()

    return {
        "calendar": calendar_column.replace("_date", ""),
        "year": year,
        "month": month,
        "total_days": len(rows),
        "dates": rows
    }


def get_last_messages_by_session(user_id: int, session_id: str, limit: int = 2):
    """Get last N messages from a specific session for context"""
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT role, content FROM messages
        WHERE user_id = %s AND session_id = %s
        ORDER BY created_at DESC
        LIMIT %s
    """, (user_id, session_id, limit))
    messages = cursor.fetchall()
    conn.close()
    return list(reversed(messages))


def get_messages_by_session(user_id: int, session_id: str, limit: int, before: str = None):
    """Get messages from a specific session"""
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    if before:
        cursor.execute("""
            SELECT * FROM messages
            WHERE user_id = %s AND session_id = %s AND created_at < %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, session_id, before, limit))
    else:
        cursor.execute("""
            SELECT * FROM messages
            WHERE user_id = %s AND session_id = %s
            ORDER BY created_at DESC
            LIMIT %s
        """, (user_id, session_id, limit))

    messages = cursor.fetchall()
    conn.close()
    return messages


#  add state to states table
def add_state(state_name: str):
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT IGNORE INTO states (state_name) VALUES (%s)",
        (state_name,)
    )

    conn.commit()
    affected = cursor.rowcount
    conn.close()

    return affected > 0

#  add district to districts table
def add_district(state_id: int, district_name: str):
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT IGNORE INTO districts (state_id, district_name)
        VALUES (%s, %s)
    """, (state_id, district_name))

    conn.commit()
    affected = cursor.rowcount
    conn.close()

    return affected > 0

#   upsert poem stats for a district
def upsert_poem_stats(poem_id: str, district_id: int, score: float, count: int):
    conn = database.get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO poem_district_stats (poem_id, district_id, score, count)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE
            score = VALUES(score),
            count = VALUES(count)
    """, (poem_id, district_id, score, count))

    conn.commit()
    conn.close()



#   get all poem stats with state and district names
def get_all_poem_stats():
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT 
        p.poem_id,
        p.poem,
        s.state_name,
        d.district_name,
        ps.score,
        ps.count
    FROM poem_district_stats ps
    JOIN poems p ON p.poem_id = ps.poem_id
    JOIN districts d ON d.id = ps.district_id
    JOIN states s ON s.id = d.state_id
    ORDER BY s.state_name, d.district_name
    """)

    data = cursor.fetchall()
    conn.close()
    return data

#   get poem stats for a specific state
def get_stats_by_state(state_id: int):
    conn = database.get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("""
    SELECT 
        p.poem_id,
        d.district_name,
        ps.score,
        ps.count
    FROM poem_district_stats ps
    JOIN districts d ON d.id = ps.district_id
    WHERE d.state_id = %s
    """, (state_id,))

    data = cursor.fetchall()
    conn.close()
    return data
