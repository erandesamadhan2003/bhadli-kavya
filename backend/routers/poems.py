from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, File
import csv
import uuid
from typing import Optional
import models, auth
import database

router = APIRouter(prefix="/api/poems", tags=["poems"])

# Season mapping: English -> Database season patterns
SEASON_MAPPING = {
    "spring": ["Vasant", "Spring"],
    "summer": ["Grishma", "Summer"],
    "monsoon": ["Varsha", "Monsoon"],
    "autumn": ["Sharad", "Autumn"],
    "prewinter": ["Hemant", "PreWinter"],
    "winter": ["Shishir", "Winter"]
}

# 1️⃣ Create a poem
@router.post("/create")
def create_poem(
    body: dict,
    user_id: int = Depends(auth.get_current_user_id)
):
    poem = body.get("poem")
    language = body.get("language")
    season = body.get("season")
    location = body.get("location")

    if not all([poem, language, season, location]):
        raise HTTPException(status_code=400, detail="All fields (poem, language, season, location) are required")

    created = models.create_poem(poem, language, season, location)
    return {"message": "Poem created successfully", "poem": created}


# 2️⃣ Get all poems (with optional filters)
@router.get("/")
def list_poems(
    language: Optional[str] = Query(None),
    season: Optional[str] = Query(None),
    location: Optional[str] = Query(None)
):
    poems = models.get_poems(language, season, location)
    return {"poems": poems}

# 5.4 GET /api/poems/season-counts
@router.get("/season-counts")
def get_poem_counts_by_season():
    counts = models.get_poem_counts_by_season()
    return {"counts": counts}


# 3️⃣ Get a single poem
@router.get("/{poem_id}")
def get_poem(poem_id: str):
    poem = models.get_poem_by_id(poem_id)
    if not poem:
        raise HTTPException(status_code=404, detail="Poem not found")
    return {"poem": poem}


# 4️⃣ Delete a poem
@router.delete("/{poem_id}", status_code=200)
def delete_poem(poem_id: str, user_id: int = Depends(auth.get_current_user_id)):
    deleted = models.delete_poem(poem_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Poem not found")
    return {"message": "Poem deleted successfully"}


# 5.1 GET /api/poems/language/{language}
@router.get("/language/{language}")
def get_poems_by_language(language: str, limit: int = 5, before: Optional[str] = None):
    if not language:
        raise HTTPException(status_code=400, detail="Language parameter is required")
    poems = models.get_poems_by_language(language, limit, before)
    return {"language": language, "poems": poems}


# 5.2 GET /api/poems/season/{season}
@router.get("/season/{season}")
def get_poems_by_season(season: str, limit: int = 5):
    # Normalize season name to lowercase
    season_lower = season.lower()
    
    # Get possible season names from mapping
    season_patterns = SEASON_MAPPING.get(season_lower, [season])
    
    # Use models function with season patterns
    poems = models.get_poems_by_season_patterns(season_patterns, limit)
    return {"season": season, "poems": poems}


# 5.3 GET /api/poems/location/{location}
@router.get("/location/{location}")
def get_poems_by_location(location: str, limit: int = 5):
    poems = models.get_poems_by_location(location, limit)
    return {"location": location, "poems": poems}







# 6️⃣ Upload CSV and Insert Poems
@router.post("/upload-csv")
async def upload_poems_csv(
    file: UploadFile = File(...)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")

    conn = database.get_connection()
    cursor = conn.cursor()

    inserted_count = 0
    skipped_count = 0

    try:
        content = await file.read()
        decoded = content.decode("utf-8").splitlines()
        reader = csv.DictReader(decoded)

        for row in reader:
            poem_text = row.get("Poems") or row.get("poem")
            language = row.get("language")
            season = row.get("season")
            location = row.get("location")

            # Skip incomplete rows
            if not all([poem_text, language, season, location]):
                skipped_count += 1
                continue

            cursor.execute("""
                INSERT INTO poems (poem_id, poem, language, season, location)
                VALUES (%s, %s, %s, %s, %s)
            """, (str(uuid.uuid4()), poem_text.strip(), language.strip(), season.strip(), location.strip()))
            inserted_count += 1

        conn.commit()
        conn.close()

        return {
            "message": "CSV uploaded successfully",
            "inserted": inserted_count,
            "skipped": skipped_count
        }

    except Exception as e:
        conn.rollback()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {e}")

