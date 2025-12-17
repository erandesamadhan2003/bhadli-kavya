from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, upload, calendar
from routers import chat
from routers import sessions
from routers import poems
from routers.auth_routes import router as auth_router

# import database
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
app.include_router(upload.router)
app.include_router(calendar.router)
app.include_router(chat.router)
app.include_router(auth_router)
app.include_router(sessions.router)
app.include_router(poems.router)

@app.get("/")
def read_root():
    return {"message": "Kavya Backend API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
