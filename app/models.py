from pydantic import BaseModel
from typing import Optional

class EchoRequest(BaseModel):
    message: str

class EchoResponse(BaseModel):
    echo: str
    timestamp: Optional[str] = None