from fastapi import FastAPI
from . import database
from .routers import users

app = FastAPI()

@app.on_event("startup")
def startup():
    database.init_db()

@app.get("/")
def read_root():
    return {"message": "FastAPI + SQLite3 running!"}

# include users router
app.include_router(users.router)
