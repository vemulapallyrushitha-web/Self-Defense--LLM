from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
import torch
import os
import shutil
import traceback
from datetime import datetime

# ==============================
# FASTAPI APP
# ==============================
app = FastAPI(
    title="AutoDefense Chat",
    description="Dual LLM Chatbot with Database Logging"
)
router = APIRouter()

# ==============================
# CORS
# ==============================
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# DATABASE CONFIG
# ==============================
# IMPORTANT: @ is encoded as %40
DATABASE_URL = "postgresql://postgres:Rushi%401727@localhost:5432/autodefense_db"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==============================
# MODEL PATHS
# ==============================
FILTER_PATH = os.path.abspath("C:/projects/Auto_Defense/filter_llm")
GEN_PATH = os.path.abspath("C:/projects/Auto_Defense/generator_llm")

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"🖥 Using device: {device.upper()}")

filter_tokenizer = None
filter_model = None
generator_tokenizer = None
generator_model = None

# ==============================
# HELPER FUNCTIONS
# ==============================
def batch_to_device(batch, device):
    return {k: v.to(device) for k, v in batch.items() if hasattr(v, "to")}

def safe_load_4bit(path, name, prefer_gpu=True, offload_dir=None):
    print(f"🔹 Loading {name} (4-bit) from: {path}")

    tokenizer = AutoTokenizer.from_pretrained(
        path, local_files_only=True, use_fast=False
    )
    tokenizer.pad_token = tokenizer.eos_token

    if offload_dir is None:
        offload_dir = f"offload_{name.lower()}"
    shutil.rmtree(offload_dir, ignore_errors=True)
    os.makedirs(offload_dir, exist_ok=True)

    bnb_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.float16,
        bnb_4bit_use_double_quant=True,
        bnb_4bit_quant_type="nf4",
    )

    device_map = "cuda" if prefer_gpu and torch.cuda.is_available() else {"": "cpu"}

    model = AutoModelForCausalLM.from_pretrained(
        path,
        local_files_only=True,
        quantization_config=bnb_config,
        device_map=device_map,
        offload_folder=offload_dir,
        low_cpu_mem_usage=True,
    )

    print(f"✅ {name} model loaded")
    return tokenizer, model

# ==============================
# LOAD MODELS ON STARTUP
# ==============================
@app.on_event("startup")
async def load_models():
    global filter_tokenizer, filter_model
    global generator_tokenizer, generator_model

    try:
        filter_tokenizer, filter_model = safe_load_4bit(
            FILTER_PATH, "Filter", prefer_gpu=False
        )
        generator_tokenizer, generator_model = safe_load_4bit(
            GEN_PATH, "Generator", prefer_gpu=True
        )
        print("🎉 All models loaded successfully")
    except Exception:
        print("❌ Model loading failed")
        traceback.print_exc()

# ==============================
# CHAT ENDPOINT
# ==============================
@router.post("/chat")
async def chat_with_llms(request: dict, db: Session = Depends(get_db)):
    try:
        user_input = request.get("message", "").strip()
        if not user_input:
            raise HTTPException(status_code=400, detail="Message is required")

        # ------------------------------
        # INSERT PROMPT
        # ------------------------------
        prompt_result = db.execute(
            text("""
                INSERT INTO prompts (user_id, prompt_text, created_at)
                VALUES (:user_id, :prompt_text, :created_at)
                RETURNING prompt_id
            """),
            {
                "user_id": 1,  # default user
                "prompt_text": user_input,
                "created_at": datetime.utcnow(),
            }
        )
        prompt_id = prompt_result.scalar()

        # ------------------------------
        # GENERATE RESPONSE
        # ------------------------------
        chat_prompt = f"User: {user_input}\nAI:"
        inputs = generator_tokenizer(chat_prompt, return_tensors="pt", padding=True)
        inputs = batch_to_device(inputs, device)

        with torch.no_grad():
            outputs = generator_model.generate(
                **inputs,
                max_new_tokens=150,
                temperature=0.8,
                top_p=0.95,
                do_sample=True,
                pad_token_id=generator_tokenizer.pad_token_id,
            )

        generated_text = generator_tokenizer.decode(
            outputs[0], skip_special_tokens=True
        )
        generated_text = generated_text.split("AI:")[-1].strip()

        # ------------------------------
        # INSERT RESPONSE
        # ------------------------------
        db.execute(
            text("""
                INSERT INTO responses (
                    prompt_id,
                    harmful_response,
                    safe_response,
                    llm_response_harmful_flag,
                    created_at
                )
                VALUES (:prompt_id, :harmful_response, :safe_response, :flag, :created_at)
            """),
            {
                "prompt_id": prompt_id,
                "harmful_response": None,
                "safe_response": generated_text,
                "flag": False,
                "created_at": datetime.utcnow(),
            }
        )

        # ------------------------------
        # LOG EVENT
        # ------------------------------
        db.execute(
            text("""
                INSERT INTO logs (event, created_at)
                VALUES (:event, :created_at)
            """),
            {
                "event": "Chat request processed successfully",
                "created_at": datetime.utcnow(),
            }
        )

        db.commit()

        return {"response": generated_text}

    except Exception as e:
        db.rollback()
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

# ==============================
# ROOT
# ==============================
@app.get("/")
async def root():
    return {"message": "AutoDefense Chat API is running"}

app.include_router(router)

# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)