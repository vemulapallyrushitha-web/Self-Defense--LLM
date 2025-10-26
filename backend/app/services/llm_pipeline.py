# app/services/llm_pipeline.py
from app.config import LLM_API_KEY

def get_llm_response(prompt: str) -> str:
    # Replace this with your actual LLM API call
    # For now, simulate a response
    return f"Simulated response for: {prompt}"
