from fastapi import APIRouter, Depends, HTTPException
from .. import models, auth

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/send")
def send_message(body: dict, user_id: int = Depends(auth.get_current_user_id)):
    message = body.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")

    models.save_message(user_id, "user", message)

    history = models.get_last_messages(user_id, limit=2)

    ai_response = " + ".join([m["content"] for m in history]) + " + This is a AI automated response"

    saved = models.save_message(user_id, "model", ai_response)

    return {"modelResponse": saved}


@router.get("/history")
def chat_history(limit: int = 10, before: str = None, user_id: int = Depends(auth.get_current_user_id)):
    messages = models.get_messages(user_id, limit, before)
    return list(reversed(messages))



@router.delete("/message/{message_id}", status_code=204)
def delete_message(message_id: str, user_id: int = Depends(auth.get_current_user_id)):
    deleted = models.delete_message(message_id, user_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Message not found / not owned by user")
    
    return { "status": "deleted" }



