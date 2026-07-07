import os
import json
from fastapi import APIRouter, HTTPException
from backend.schemas.models import ChatMessage, ChatResponse
from backend.services.gemini import GeminiService

router = APIRouter(prefix="/api/chat", tags=["Chat"])

CHAT_HISTORY_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "chat_history.json")

def load_chat_history() -> dict:
    try:
        if os.path.exists(CHAT_HISTORY_FILE):
            with open(CHAT_HISTORY_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
        return {}
    except Exception as e:
        print(f"Error loading chat history: {e}")
        return {}

def save_chat_history(history: dict):
    try:
        os.makedirs(os.path.dirname(CHAT_HISTORY_FILE), exist_ok=True)
        with open(CHAT_HISTORY_FILE, "w", encoding="utf-8") as f:
            json.dump(history, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving chat history: {e}")

@router.post("", response_model=ChatResponse)
async def chat_message(payload: ChatMessage):
    user_id = payload.user_id
    message = payload.message
    lang = payload.language_code

    history = load_chat_history()
    user_history = history.get(user_id, [])

    # Send the history to Gemini context. We pass the last 10 messages to avoid token bloat
    gemini_history = user_history[-10:] if len(user_history) > 10 else user_history

    # Call Gemini Service
    ai_response = GeminiService.generate_chat_reply(message, lang, gemini_history)

    # Append to history
    user_history.append({"role": "user", "content": message})
    user_history.append({"role": "assistant", "content": ai_response.get("reply", "")})
    history[user_id] = user_history
    save_chat_history(history)

    return ChatResponse(
        reply=ai_response.get("reply", "No response received."),
        suggested_actions=ai_response.get("suggested_actions", [])
    )

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    history = load_chat_history()
    return history.get(user_id, [])

@router.delete("/history/{user_id}")
async def clear_history(user_id: str):
    history = load_chat_history()
    if user_id in history:
        del history[user_id]
        save_chat_history(history)
    return {"status": "success", "message": "Chat history cleared."}
