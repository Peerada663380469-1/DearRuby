import os
from PIL import Image

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
        
    print(f"Trimming {f}...")
    try:
        img = Image.open(path).convert("RGBA")
        
        # Get bounding box of non-transparent pixels
        # getbbox() works on the alpha channel if we split it
        # Actually, getbbox() works on the whole image but treats pure black as zero.
        # It's safer to extract alpha channel and get its bbox
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        
        if bbox:
            cropped = img.crop(bbox)
            cropped.save(path)
            print(f"Successfully trimmed {f}")
        else:
            print(f"Could not find bounding box for {f}")
    except Exception as e:
        print(f"Error processing {f}: {e}")

print("All done!")
