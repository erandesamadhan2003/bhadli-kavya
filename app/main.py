from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models import EchoRequest
import uvicorn

app = FastAPI(title="ChatBot API", description="AI ChatBot Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "ChatBot API is running!"}

@app.post("/echo")
async def echo(input: EchoRequest):
    response_message = f"{input.message}"
    return {"echo": response_message}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "ChatBot backend is running"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)