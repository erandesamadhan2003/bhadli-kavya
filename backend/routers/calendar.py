from fastapi import APIRouter, Query
from .. import models

router = APIRouter(
    prefix="/calendar",
    tags=["calendar"]
)

@router.get("/month/")
def get_calendar_of_month(
    year: str = Query(..., description="Year in Vikram Samvat"),
    month: str = Query(..., description="Month in Vikram Samvat"),
    calendar_type: str = Query("hindi", description="Calendar type: hindi or gujarati")
):
    try:
        data = models.get_calendar_of_month(year, month, calendar_type)
    except ValueError as e:
        return {"error": str(e)}

    if not data:
        return {"message": "No data found for this month"}

    # Combine both date fields neatly
    dates_list = [
        {
            "vikram_samvat_date": item["vikram_samvat_date"],
            "gregorian_date": item["gregorian_date"]
        }
        for item in data
    ]

    return {
        "vikram_samvat_month": f"{month} {year}",
        "calendar_type": calendar_type,
        "total_days": len(dates_list),
        "dates": dates_list
    }
