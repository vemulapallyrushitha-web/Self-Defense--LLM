import os
from transformers import AutoTokenizer, AutoModelForCausalLM

path = os.path.abspath("C:/Users/vemul/OneDrive/Desktop/Auto_Defense/Filter_LLM")
print(f"🔍 Loading model from: {path}")

if not os.path.exists(os.path.join(path, "config.json")):
    raise FileNotFoundError("❌ config.json not found in your Filter_LLM folder!")

tok = AutoTokenizer.from_pretrained(pretrained_model_name_or_path=path, local_files_only=True, use_fast=False)
model = AutoModelForCausalLM.from_pretrained(
    pretrained_model_name_or_path=path,
    local_files_only=True,
    low_cpu_mem_usage=True,
    torch_dtype="auto",
    device_map="auto"
)

print("✅ Model loaded successfully!")

inputs = tok("Hello!", return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=20)
print("🧠 Model output:")
print(tok.decode(outputs[0], skip_special_tokens=True))