import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import menuRoutes from './routes/menu.js';
import reservationsRoutes from './routes/reservations.js';
import eventsRoutes from './routes/events.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1); // Trust first proxy (ngrok) to fix express-rate-limit error
const PORT = process.env.PORT || 3001;

// CORS — restrict to frontend origin
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));

app.use(express.json());

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false, // allow images to load from other origins if needed
  contentSecurityPolicy: false, // Disabled so Google Fonts and Unsplash images can load
}));

// Static file serving for uploaded food images
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Ensure upload directory exists
import fs from 'fs';
const foodDir = path.join(__dirname, '../client/public/images/food');
if (!fs.existsSync(foodDir)) fs.mkdirSync(foodDir, { recursive: true });

// Rate limiting for login (5 attempts per minute per IP)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many login attempts. Please wait 1 minute.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Global Rate Limiting for all API routes (protect against basic DDoS)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// Public routes (no auth required)
app.use('/api/reservations', reservationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/menu', menuRoutes); // Menu is now fully public

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React Frontend (Bypassing Netlify Limits)
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

import { seedDatabase } from './db.js';

seedDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🍽️  POS Server running on http://localhost:${PORT}`); 
});
}).catch(err => {
  console.error("Failed to seed database:", err);
});
