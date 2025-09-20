from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users
import database

# Initialize database on startup
database.init_db()

app = FastAPI(title="Kavya Backend API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Kavya Backend API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
