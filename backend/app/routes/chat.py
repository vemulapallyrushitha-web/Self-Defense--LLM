from fastapi import APIRouter
from app.services.llm_pipeline import get_llm_response

router = APIRouter()

@router.get("/chat")
def chat_root(message: str = "Hello"):
    response = get_llm_response(message)
    return {"response": response}
