from fastapi import APIRouter, HTTPException
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
import os

router = APIRouter()

# -------------------------------
# Local model paths
# -------------------------------
FILTER_PATH = os.path.abspath("C:/projects/Auto_Defense/filter_llm")
GEN_PATH = os.path.abspath("C:/projects/Auto_Defense/generator_llm")

# -------------------------------
# Devices
# -------------------------------
GEN_DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
FILTER_DEVICE = "cpu"

print(f"🖥 Generator device: {GEN_DEVICE}")
print(f"🛡 Filter device: {FILTER_DEVICE}")

# -------------------------------
# Model loader (UNCHANGED)
# -------------------------------
def load_model(path, name, device, quantize=False):
    print(f"🔹 Loading {name} from {path}")

    tokenizer = AutoTokenizer.from_pretrained(
        path,
        local_files_only=True,
        use_fast=False
    )

    tokenizer.pad_token = tokenizer.eos_token

    if quantize and device == "cuda":
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4"
        )

        model = AutoModelForCausalLM.from_pretrained(
            path,
            local_files_only=True,
            quantization_config=bnb_config,
            device_map="auto"
        )
    else:
        model = AutoModelForCausalLM.from_pretrained(
            path,
            local_files_only=True
        ).to(device)

    model.eval()
    print(f"✅ {name} loaded")
    return tokenizer, model

# -------------------------------
# Load models
# -------------------------------
filter_tokenizer, filter_model = load_model(
    FILTER_PATH, "Filter", FILTER_DEVICE, quantize=False
)

generator_tokenizer, generator_model = load_model(
    GEN_PATH, "Generator", GEN_DEVICE, quantize=True
)

# -------------------------------
# Chat endpoint
# -------------------------------
@router.post("/chat")
async def chat_with_llms(request: dict):
    try:
        user_input = request.get("message", "").strip()
        if not user_input:
            raise HTTPException(status_code=400, detail="Message is required")

        # ==================================================
        # 🔍 FILTER USER INPUT (UNCHANGED)
        # ==================================================
        filt_prompt = f"""
Analyze the following user input.
Reply with ONLY one word: safe or unsafe.

User input:
{user_input}
"""

        filt_inputs = filter_tokenizer(
            filt_prompt,
            return_tensors="pt"
        ).to(FILTER_DEVICE)

        with torch.no_grad():
            filt_outputs = filter_model.generate(
                **filt_inputs,
                max_new_tokens=1,
                do_sample=False,
                pad_token_id=filter_tokenizer.eos_token_id
            )

        verdict = filter_tokenizer.decode(
            filt_outputs[0],
            skip_special_tokens=True
        ).strip().lower().split()[0]

        if verdict == "unsafe":
            return {
                "response": "⚠️ This request is unsafe. Please ask a safe or legal question."
            }

        # ==================================================
        # 🤖 GENERATOR (FIXED BEHAVIOR)
        # ==================================================

        # 🔹 STRONG CHAT PROMPT (KEY FIX)
        prompt = f"""
You are a friendly conversational AI assistant.
Reply naturally like a human chatbot.
If the user greets you or says thanks, reply briefly.
Give longer answers only when the user asks for explanations.

User: {user_input}
Assistant:"""

        inputs = generator_tokenizer(
            prompt,
            return_tensors="pt"
        ).to(generator_model.device)

        # 🔹 DYNAMIC RESPONSE CONTROL (KEY FIX)
        short_input = len(user_input.split()) <= 4
        max_tokens = 35 if short_input else 250
        do_sample_flag = not short_input

        with torch.no_grad():
            outputs = generator_model.generate(
                **inputs,
                max_new_tokens=max_tokens,
                temperature=0.7,
                top_p=0.9,
                do_sample=do_sample_flag,
                repetition_penalty=1.1,
                eos_token_id=generator_tokenizer.eos_token_id,
                pad_token_id=generator_tokenizer.eos_token_id
            )

        # 🔹 DECODE ONLY NEW TOKENS (KEY FIX)
        decoded = generator_tokenizer.decode(
            outputs[0][inputs["input_ids"].shape[-1]:],
            skip_special_tokens=True
        ).strip()

        # 🔹 STOP RAMBLING
        decoded = decoded.split("\n")[0]

        return {"response": decoded}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))