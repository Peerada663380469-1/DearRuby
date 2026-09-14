import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import connectPgSimple from 'connect-pg-simple';
import crypto from 'crypto';
import morgan from 'morgan';
import fs from 'fs';

import menuRoutes from './routes/menu.js';
import authRoutes from './routes/auth.js';
import reservationsRoutes from './routes/reservations.js';
import eventsRoutes from './routes/events.js';
import profileRoutes from './routes/profile.js';
import { groundTruth } from './middleware/groundTruth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;
const TESTBED = process.env.TESTBED === 'true';

const PgSession = connectPgSimple(session);

// Ensure log directories exist for Render
const nginxLogDir = path.join(__dirname, '../logs/nginx');
if (!fs.existsSync(nginxLogDir)) fs.mkdirSync(nginxLogDir, { recursive: true });

// Morgan NGINX Custom Format Setup
morgan.token('trace', (req) => req.cookies?.trace || '-');
morgan.token('msec', () => (Date.now() / 1000).toFixed(3));
morgan.token('referrer', (req) => req.headers.referer || req.headers.referrer || '-');
const nginxFormat = ':msec :remote-addr - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":trace" :response-time';

const accessLogStream = fs.createWriteStream(path.join(nginxLogDir, 'idor_nginx.log'), { flags: 'a' });
app.use(morgan(nginxFormat, { stream: accessLogStream }));
app.use(morgan(nginxFormat)); // Also log to Render console

// CORS
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning']
}));

app.use(express.json());
app.use(cookieParser());

// Session Configuration (PostgreSQL store)
app.use(session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true
  }),
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'fallback_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 3600000 }
}));

// Trace Cookie Injection (for Isolation Forest logging)
app.use((req, res, next) => {
  if (!req.session.trace) {
    req.session.trace = crypto.randomBytes(8).toString('hex');
    res.cookie('trace', req.session.trace, { httpOnly: false, sameSite: 'lax' });
  }
  next();
});

// Ground Truth Logging Middleware
app.use(groundTruth);

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false,
}));

// Serve static food images
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// Rate Limiting (Disabled in TESTBED mode)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

if (!TESTBED) {
  app.use('/api/', apiLimiter);
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/menu', menuRoutes);

// Log Download Endpoints for Render
app.get('/api/logs/access', (req, res) => {
  const file = path.join(__dirname, '../logs/nginx/idor_nginx.log');
  if (fs.existsSync(file)) res.download(file);
  else res.status(404).json({ error: 'No access logs found yet.' });
});

app.get('/api/logs/groundtruth', (req, res) => {
  const file = path.join(__dirname, '../logs/ground_truth/app_ground_truth.csv');
  if (fs.existsSync(file)) res.download(file);
  else res.status(404).json({ error: 'No ground truth logs found yet.' });
});

// Seed Endpoint for Render (no CLI access)
app.post('/api/admin/seed', async (req, res) => {
  if (!TESTBED) return res.status(403).json({ error: 'Seed disabled in production' });
  try {
    const { execSync } = await import('child_process');
    execSync('node prisma/seed.js', { cwd: path.resolve(__dirname), stdio: 'pipe', timeout: 60000 });
    res.json({ ok: true, message: 'Seed completed successfully' });
  } catch (err) {
    console.error('Seed error:', err.stderr?.toString() || err.message);
    res.status(500).json({ error: 'Seed failed', details: err.stderr?.toString() || err.message });
  }
});

// Seed Menu Items for Render
app.post('/api/admin/seed-menu', async (req, res) => {
  if (!TESTBED) return res.status(403).json({ error: 'Seed disabled in production' });
  try {
    const prisma = (await import('./db.js')).default;
    const count = await prisma.menuItem.count();
    if (count > 0) return res.json({ ok: true, message: `Menu already has ${count} items, skipping.` });
    
    const menuItems = [
      { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true },
      { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters' },
      { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true },
      { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isSpicy: true },
      { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters' },
      { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains' },
      { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains' },
      { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isSpicy: true },
      { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains' },
      { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains' },
      { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true },
      { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true },
      { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isSpicy: true },
      { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza' },
      { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true },
      { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isSpicy: true },
      { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true },
      { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true },
      { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true },
      { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true },
      { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true },
      { name: 'Evian Natural Spring Water', price: 180, category: 'Drinks', isVegetarian: true },
      { name: 'San Pellegrino Sparkling', price: 200, category: 'Drinks', isVegetarian: true },
      { name: 'Tokyo Sour Cocktail', price: 520, category: 'Drinks', isVegetarian: true },
      { name: 'Lavender Collins', price: 490, category: 'Drinks', isVegetarian: true },
      { name: 'Alta Vigna - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true },
      { name: 'Vento Rosso - Sardinian Rosé', price: 1820, category: 'Premium Wines', isVegetarian: true },
      { name: 'Luce Di Terra - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true },
    ];
    await prisma.menuItem.createMany({ data: menuItems });
    res.json({ ok: true, message: `Seeded ${menuItems.length} menu items` });
  } catch (err) {
    console.error('Menu seed error:', err);
    res.status(500).json({ error: 'Menu seed failed', details: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React Frontend
const distPath = path.join(__dirname, '../client/dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`🍽️  POS Server running on http://localhost:${PORT} (TESTBED: ${TESTBED})`);
  // Run migrate deploy in background after port is open (so Render detects it)
  try {
    const { execSync } = await import('child_process');
    console.log('Running prisma migrate deploy...');
    execSync('npx prisma migrate deploy', { cwd: path.resolve(__dirname), stdio: 'inherit', timeout: 30000 });
    console.log('✅ Prisma migrate deploy completed.');
  } catch (err) {
    console.warn('⚠️  Prisma migrate deploy skipped or failed:', err.message);
  }
});
