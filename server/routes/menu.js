import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../db.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../client/public/images/food');

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'food-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// GET /api/menu — Available items only (for public pre-order)
router.get('/', async (req, res) => {
  try {
    const items = await prisma.menuItem.findMany({ 
      where: { isAvailable: true, isDeleted: false } 
    });
    const categories = [...new Set(items.map(i => i.category))];
    res.json({ categories, items });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
