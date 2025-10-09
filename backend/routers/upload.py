from fastapi import APIRouter, UploadFile, File,Form, HTTPException
import shutil
import os
from backend import models

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload-csv/")
async def upload_csv(
    file: UploadFile = File(...),
    calendar_type: str = Form(...)
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed")

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded file temporarily
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Insert into DB
    result = models.insert_csv_into_calendar(file_path, calendar_type)

    return result
