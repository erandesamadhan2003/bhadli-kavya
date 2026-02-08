from fastapi import APIRouter, Depends, HTTPException, Query
import models, auth

router = APIRouter(prefix="/api/chat", tags=["chat"])

@router.post("/send")
def send_message(body: dict, user_id: int = Depends(auth.get_current_user_id)):
    """
    Send a message from the user to the AI.
    Links message to a session_id (conversation thread).
    """
    message = body.get("message")
    session_id = body.get("session_id")
    
    if not message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    if not session_id:
        raise HTTPException(status_code=400, detail="Session ID is required")

    # Save the user's message
    user_message = models.save_message(user_id, "user", message, session_id=session_id)

    # Get the last 2 messages for context FROM THIS SESSION ONLY
    history = models.get_last_messages_by_session(user_id, session_id, limit=2)

    # Fake AI response for now
    ai_response = " + ".join([m["content"] for m in history]) + " + This is an AI automated response"

    # Save model's response
    model_message = models.save_message(user_id, "model", ai_response, session_id=session_id)

    return {
        "userMessage": user_message,
        "modelResponse": model_message
    }


@router.get("/history")
def chat_history(
    session_id: str = Query(None),
    limit: int = 10,
    before: str = None,
    user_id: int = Depends(auth.get_current_user_id)
):
    """
    Get chat history for the logged-in user.
    If session_id is provided, only get messages from that session.
    """
    if session_id:
        messages = models.get_messages_by_session(user_id, session_id, limit, before)
    else:
        messages = models.get_messages(user_id, limit, before)
    
    return list(reversed(messages))


@router.delete("/message/{message_id}", status_code=200)
def delete_message(message_id: str, user_id: int = Depends(auth.get_current_user_id)):
    print(f"🧩 Deleting message {message_id} for user_id={user_id}")
    deleted = models.delete_message(message_id, user_id)

    if not deleted:
        # Double check if it exists but belongs to someone else
        from .. import database
        conn = database.get_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT user_id FROM messages WHERE message_id = %s", (message_id,))
        msg = cursor.fetchone()
        conn.close()

        if msg:
            raise HTTPException(status_code=403, detail="Message exists but belongs to another user")
        else:
            raise HTTPException(status_code=404, detail="Message not found")

    return {"status": "deleted", "message_id": message_id}
