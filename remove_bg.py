from rembg import remove
from PIL import Image
import sys
import os

def remove_background(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"Error: Could not find file '{input_path}'")
        return
        
    print(f"Removing background from '{input_path}'...")
    try:
        # Load the input image
        input_image = Image.open(input_path)
        
        # Remove the background using AI model (U-2-Net)
        output_image = remove(input_image)
        
        # Save the result as a PNG (to preserve transparency)
        output_image.save(output_path, "PNG")
        print(f"Success! Saved transparent image to '{output_path}'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python remove_bg.py <input_image_path> <output_image_path>")
        print("Example: python remove_bg.py image.jpg image_transparent.png")
        sys.exit(1)
        
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    remove_background(input_file, output_file)
