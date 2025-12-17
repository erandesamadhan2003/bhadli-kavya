from fastapi import APIRouter, UploadFile, File, HTTPException, Query, Depends
import csv
from datetime import datetime
import models, auth

router = APIRouter(prefix="/api/calendar", tags=["calendar"])

@router.post("/upload-csv")
def upload_calendar_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    try:
        content = file.file.read().decode("utf-8").splitlines()
        reader = csv.DictReader(content)

        inserted = 0
        for row in reader:
            models.insert_calendar_row(row)
            inserted += 1

        return {
            "message": "Calendar CSV uploaded successfully",
            "rows_processed": inserted
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
    
    
# --------------------------------------------------
# 6.1 GET /api/calendar/month
# --------------------------------------------------
@router.get("/month")
def get_calendar_month(
    year: int,
    month: int,
    calendar: str = "gregorian"
):
    return models.get_calendar_month(year, month, calendar)



# --------------------------------------------------
# 6.2 GET /api/calendar/me
# --------------------------------------------------
@router.get("/me")
def get_my_calendar(user_id: int = Depends(auth.get_current_user_id)):
    return models.get_calendar_for_user(user_id)

