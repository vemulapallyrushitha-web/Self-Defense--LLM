from fastapi import APIRouter, Request
from ..model_loader import generate_response  # ✅ correct import

router = APIRouter()

# Optional: a quick GET test for browser
@router.get("/chat")
def chat_root(message: str = "Hello"):
    response = generate_response(message)
    return {"response": response}

# Actual endpoint used by frontend
@router.post("/chat")
async def chat(request: Request):
    data = await request.json()
    user_input = data.get("message", "")

    try:
        response = generate_response(user_input)
    except Exception as e:
        # Mock fallback for demo if model fails
        response = f"(Mock) I received your message: {user_input}"

    return {"reply": response}
