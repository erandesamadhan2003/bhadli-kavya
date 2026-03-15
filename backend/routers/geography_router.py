from fastapi import APIRouter, Depends, HTTPException
import models, auth

router = APIRouter(prefix="/geo", tags=["Geography"])


@router.post("/states")
def add_state(state_name: str, user_id: int = Depends(auth.get_current_user_id)):
    if not models.add_state(state_name):
        raise HTTPException(400, "State already exists")
    return {"message": f"{state_name} added"}


@router.post("/districts")
def add_district(state_id: int, district_name: str, user_id: int = Depends(auth.get_current_user_id)):
    if not models.add_district(state_id, district_name):    
        raise HTTPException(400, "District already exists")
    return {"message": f"{district_name} added"}


@router.post("/stats")
def upsert_stats(poem_id: str, district_id: int, score: float, count: int,
                 user_id: int = Depends(auth.get_current_user_id)):
    models.upsert_poem_stats(poem_id, district_id, score, count)
    return {"message": "Stats saved"}


@router.get("/stats")
def get_all_stats(user_id: int = Depends(auth.get_current_user_id)):
    return models.get_all_poem_stats()


@router.get("/stats/state/{state_id}")
def get_state_stats(state_id: int, user_id: int = Depends(auth.get_current_user_id)):
    return models.get_stats_by_state(state_id)


@router.get("/map-data")
def get_map_data(poem_id: str, metric: str, user_id: int = Depends(auth.get_current_user_id)):
    return models.get_map_data(poem_id, metric)