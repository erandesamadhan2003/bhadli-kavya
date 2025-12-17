from fastapi import APIRouter, Depends, HTTPException
import models, auth

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

# 1️⃣ Create a new session
@router.post("/create")
def create_session(body: dict, user_id: int = Depends(auth.get_current_user_id)):
    title = body.get("title", "Untitled Session")
    session = models.create_session(user_id, title)
    return {"message": "Session created successfully", "session": session}


# 2️⃣ Get all sessions of the logged-in user
@router.get("/")
def list_sessions(user_id: int = Depends(auth.get_current_user_id)):
    sessions = models.get_sessions_by_user(user_id)
    return {"sessions": sessions}


# 3️⃣ End a session
@router.put("/{session_id}/end")
def end_session(session_id: str, user_id: int = Depends(auth.get_current_user_id)):
    ended = models.end_session(session_id, user_id)
    if not ended:
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    return {"message": "Session ended successfully", "session_id": session_id}


# 4️⃣ Get session details
@router.get("/{session_id}")
def get_session(session_id: str, user_id: int = Depends(auth.get_current_user_id)):
    session = models.get_session_by_id(session_id, user_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found or not owned by user")
    return {"session": session}
