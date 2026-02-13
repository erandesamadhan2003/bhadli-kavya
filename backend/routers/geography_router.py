from fastapi import APIRouter, HTTPException
from db import get_connection

router = APIRouter(prefix="/geo", tags=["Geography"])

# ==================================================
# 1️⃣ ADD STATE
# ==================================================
@router.post("/states")
def add_state(state_name: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT IGNORE INTO states (state_name) VALUES (%s)",
        (state_name,)
    )

    conn.commit()
    conn.close()

    return {"message": f"{state_name} added"}

# ==================================================
#  2️⃣ ADD DISTRICT
# ==================================================
@router.post("/districts")
def add_district(state_id: int, district_name: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT IGNORE INTO districts (state_id, district_name)
        VALUES (%s, %s)
    """, (state_id, district_name))

    conn.commit()
    conn.close()

    return {"message": f"{district_name} added"}


# ==================================================
# 3️⃣ ADD / UPDATE POEM DISTRICT STATS
# ==================================================
@router.post("/stats")
def upsert_stats(poem_id: str, district_id: int, score: float, count: int):
    conn = get_connection()
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

    return {"message": "Stats saved"}



# ==================================================
# 4️⃣ GET ALL STATS
# ==================================================
@router.get("/stats")
def get_all_stats():
    conn = get_connection()
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

# ==================================================
# 5️⃣ GET STATS BY STATE
# ==================================================
@router.get("/stats/state/{state_id}")
def get_state_stats(state_id: int):
    conn = get_connection()
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