import sys
import os
try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Please install rembg and Pillow")
    sys.exit(1)

files = [
    "Alta Vigna - Cannonau di Sardegna.png",
    "Luce Di Terra - Isola dei Nuraghi.png",
    "Vento Rosso - Sardinian Rosé wine.png"
]

for f in files:
    path = f"client/public/images/{f}"
    if not os.path.exists(path):
        print(f"File not found: {path}")
        continue
        
    print(f"Processing {f}...")
    try:
        input_img = Image.open(path)
        
        # Remove background (makes it transparent)
        output_img = remove(input_img)
        
        # Save back to the same path
        output_img.save(path)
        print(f"Successfully processed {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("All done!")
