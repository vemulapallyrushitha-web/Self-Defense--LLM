# app/services/llm_pipeline.py
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
import os

# =========================================================
# ⚙️ Device setup (GPU if available)
# =========================================================
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🔥 Using device: {device.upper()}")

# =========================================================
# 🧩 Load your local Llama model
# =========================================================
MODEL_PATH = os.path.abspath("C:/projects/Auto_Defense/generator_llm")

print(f"🔹 Loading model from: {MODEL_PATH}")

try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH, local_files_only=True)
    model = AutoModelForCausalLM.from_pretrained(
        MODEL_PATH,
        torch_dtype=torch.float16 if device == "cuda" else torch.float32,
        local_files_only=True
    ).to(device)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"❌ Failed to load model: {e}")
    tokenizer, model = None, None


# =========================================================
# 💬 Function to get model response
# =========================================================
def get_llm_response(prompt: str) -> str:
    """
    Generate a response from the local Llama model.
    """
    if not model or not tokenizer:
        return "⚠ Model not loaded."

    # Prepare input
    inputs = tokenizer(f"User: {prompt}\nAI:", return_tensors="pt").to(device)

    # Generate response
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=150,
            temperature=0.7,
            top_p=0.9,
            do_sample=True,
            pad_token_id=tokenizer.eos_token_id
        )

    # Decode text
    response = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Extract only the AI’s reply
    if "AI:" in response:
        response = response.split("AI:")[-1].strip()

    return response

