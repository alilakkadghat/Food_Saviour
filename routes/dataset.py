from fastapi import APIRouter
from db.csv_db import get_events#, get_ngos

router = APIRouter()

@router.get("/events")
def read_events():
    df = get_events()
    return df.to_dict(orient="records")

#@router.get("/ngos")
#def read_ngos():
#    df = get_ngos()
#    return df.to_dict(orient="records")
