import os
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

# ✅ Path to your Generator model
path = os.path.abspath("C:/Users/vemul/OneDrive/Desktop/Auto_Defense/Generator_LLM")

print(f"🔍 Loading model from: {path}")

# ✅ Sanity check
if not os.path.exists(os.path.join(path, "config.json")):
    raise FileNotFoundError("❌ config.json not found in your Generator_LLM folder!")

# ✅ Load tokenizer and model safely
tok = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=path, local_files_only=True, use_fast=False)
model = AutoModelForCausalLM.from_pretrained(
    pretrained_model_name_or_path=path,
    local_files_only=True,
    low_cpu_mem_usage=True,
    torch_dtype="auto",
    device_map="auto"
)

print("✅ Generator model loaded successfully!")

# ✅ Simple generation test
prompt = "Explain the concept of AI in simple words."
inputs = tok(prompt, return_tensors="pt").to(model.device)

with torch.no_grad():
    outputs = model.generate(**inputs, max_new_tokens=40)

print("🧠 Generator Model Output:")
print(tok.decode(outputs[0], skip_special_tokens=True))