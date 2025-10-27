from transformers import AutoTokenizer, AutoModelForCausalLM
from pathlib import Path
import torch

# ✅ Point directly to your model folder
MODEL_DIR = Path(__file__).resolve().parent.parent.parent / "models" / "llama2-generator-final"

if not MODEL_DIR.exists():
    raise ValueError(f"❌ Model directory not found: {MODEL_DIR}")

print(f"✅ Loading model from: {MODEL_DIR}")

tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, local_files_only=True)
model = AutoModelForCausalLM.from_pretrained(MODEL_DIR, local_files_only=True)

print("✅ Model loaded successfully!")
