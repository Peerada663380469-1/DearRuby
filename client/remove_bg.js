import { Jimp } from 'jimp';

async function processImage() {
  console.log("Reading image...");
  const image = await Jimp.read('./public/images/logo.png');
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // The red background is roughly R:129, G:10, B:20 or similar dark reds.
    // The chalk text is white/off-white (R:255, G:255, B:255).
    // We make everything that has low Green/Blue transparent.
    if (g < 180 && b < 180) {
      this.bitmap.data[idx + 3] = 0; // Alpha = 0 (Transparent)
    } else {
      // It's part of the text, make it Cream (#F6F4EE -> 246, 244, 238)
      this.bitmap.data[idx + 0] = 246;
      this.bitmap.data[idx + 1] = 244;
      this.bitmap.data[idx + 2] = 238;
      // To soften edges, we could use alpha based on green value
      const alpha = Math.min(255, (g - 180) * 3.4); 
      this.bitmap.data[idx + 3] = g < 180 ? 0 : 255;
    }
  });
  
  await image.write('./public/images/logo-transparent.png');
  console.log("Done! Saved as logo-transparent.png");
}

processImage().catch(console.error);
