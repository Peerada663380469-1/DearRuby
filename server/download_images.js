import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const dir = path.join(__dirname, '../client/public/images/food');

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        res.pipe(fs.createWriteStream(filepath))
           .on('error', reject)
           .once('close', () => resolve(filepath));
      } else {
        res.resume();
        reject(new Error(`Request Failed With a Status Code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function run() {
  const items = await prisma.menuItem.findMany();
  console.log(`Found ${items.length} items. Downloading images...`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const filename = `dish_${item.id}.jpg`;
    const filepath = path.join(dir, filename);
    
    let prompt = `Fine dining luxury ${item.category} dish: ${item.name}, ${item.description}, dark moody lighting, cinematic black background, Michelin star plating, highly detailed food photography`;
    if (item.category === 'Drinks') {
      prompt = `Luxury signature cocktail: ${item.name}, ${item.description}, dark moody lighting, cinematic bar background, highly detailed beverage photography`;
    } else if (item.category === 'Premium Wines') {
      prompt = `Luxury premium wine bottle and glass: ${item.name}, ${item.description}, dark moody lighting, cinematic restaurant background, highly detailed wine photography`;
    }
    
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&seed=${1000 + i}`;
    
    try {
      console.log(`[${i+1}/${items.length}] Downloading image for ${item.name}...`);
      await downloadImage(url, filepath);
      
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { image: `/images/food/${filename}` }
      });
      console.log(`Saved and updated: ${item.name}`);
    } catch (err) {
      console.error(`Failed to download image for ${item.name}: ${err.message}`);
      // Fallback
      await prisma.menuItem.update({
        where: { id: item.id },
        data: { image: `https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80` }
      });
    }
  }
  console.log('All images downloaded and database updated!');
}

run()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
