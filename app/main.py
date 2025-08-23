from fastapi import FastAPI
from app.models import EchoRequest
import uvicorn

app = FastAPI()

@app.post("/echo")
async def echo(input: EchoRequest):
    return {"echo": input.message}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
