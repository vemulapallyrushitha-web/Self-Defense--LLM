import os
from safetensors import safe_open

path = r"C:\Users\vemul\OneDrive\Desktop\Auto_Defense\Filter_LLM"

for filename in os.listdir(path):
    if filename.endswith(".safetensors"):
        file_path = os.path.join(path, filename)
        print(f"🧪 Checking {filename}...")
        try:
            with safe_open(file_path, framework="pt") as f:
                keys = list(f.keys())
            print(f"✅ {filename} loaded successfully with {len(keys)} tensors.")
        except Exception as e:
            print(f"❌ {filename} FAILED: {e}")