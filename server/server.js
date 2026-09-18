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
import prisma from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3001;
const TESTBED = process.env.TESTBED !== 'false'; // default true

const PgSession = connectPgSimple(session);

// Ensure log directories exist for Render
const nginxLogDir = path.join(__dirname, '../logs/nginx');
if (!fs.existsSync(nginxLogDir)) fs.mkdirSync(nginxLogDir, { recursive: true });

// Morgan NGINX Custom Format Setup
morgan.token('trace', (req) => req.cookies?.trace || '-');
morgan.token('msec', () => (Date.now() / 1000).toFixed(3));
morgan.token('referrer', (req) => req.headers.referer || req.headers.referrer || '-');
// Real public client IP. On Render the socket address is only its internal proxy
// (10.x), so use the left-most X-Forwarded-For entry = the original client — needed
// to attribute an IDOR attempt to a real source.
morgan.token('clientip', (req) => {
  const xff = req.headers['x-forwarded-for'];
  if (xff) return String(xff).split(',')[0].trim();
  return req.ip || req.socket?.remoteAddress || '-';
});
const nginxFormat = ':msec :clientip - [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" ":trace" :response-time';

// When running behind the docker nginx/apache reverse proxies (local testbed),
// those proxies own the access logs (logs/nginx, logs/apache). Skip Express's own
// file access-log so we don't double-log :8080 requests and cross-log :8081/direct
// requests into idor_nginx.log. On Render (no proxy) BEHIND_PROXY is unset, so
// Express keeps writing the access log itself.
const BEHIND_PROXY = process.env.BEHIND_PROXY === 'true';
if (!BEHIND_PROXY) {
  // Persist the access log into Postgres (survives Render restarts/sleeps/deploys),
  // instead of the ephemeral filesystem. Store the fully-formatted nginx line so the
  // download endpoint returns a byte-identical .log. Fire-and-forget: a logging error
  // must never break or slow a real request.
  const dbAccessStream = {
    write: (line) => {
      prisma.$executeRawUnsafe('INSERT INTO access_log (line) VALUES ($1)', line.replace(/\n$/, ''))
        .catch(() => {});
    },
  };
  app.use(morgan(nginxFormat, { stream: dbAccessStream }));
}
app.use(morgan(nginxFormat)); // Also log to console

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

// Log Download Endpoints — served from the persistent Postgres tables.
app.get('/api/logs/access', async (req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe('SELECT line FROM access_log ORDER BY id');
    const body = rows.map((r) => r.line).join('\n') + (rows.length ? '\n' : '');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="idor_nginx.log"');
    res.send(body);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read access log', details: err.message });
  }
});

app.get('/api/logs/groundtruth', async (req, res) => {
  try {
    const rows = await prisma.$queryRawUnsafe(
      'SELECT ts, trace, template, object_id, owner_user_id, current_user_id, authorized, status FROM ground_truth_log ORDER BY id'
    );
    const header = 'timestamp,trace,template,object_id,owner_user_id,current_user_id,authorized,status';
    const lines = rows.map((r) =>
      [r.ts, r.trace, r.template, r.object_id, r.owner_user_id, r.current_user_id, r.authorized, r.status].join(',')
    );
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="app_ground_truth.csv"');
    res.send([header, ...lines].join('\n') + '\n');
  } catch (err) {
    res.status(500).json({ error: 'Failed to read ground truth', details: err.message });
  }
});

// Seed Endpoint for Render (no CLI access)
app.post('/api/admin/seed', async (req, res) => {
  if (req.query.key !== 'CY36-PHASE2') return res.status(403).json({ error: 'Invalid key' });
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
  if (req.query.key !== 'CY36-PHASE2') return res.status(403).json({ error: 'Invalid key' });
  try {
    const prisma = (await import('./db.js')).default;
    const count = await prisma.menuItem.count();
    if (count > 0) return res.json({ ok: true, message: `Menu already has ${count} items, skipping.` });
    
    // Names + images MUST match the frontend demoMenuData in client/src/pages/MenuPage.jsx
    // and prisma/seed.js so every item resolves its image.
    const menuItems = [
      { name: 'Burrata & Heirloom Tomato', price: 680, category: 'Starters', isVegetarian: true, image: '/images/Burrata-Heirloom-Tomato.png' },
      { name: 'Pan-Seared Foie Gras', price: 1250, category: 'Starters', image: '/images/Pan-Seared-Foie-Gras.png' },
      { name: 'Truffle Mushroom Arancini', price: 550, category: 'Starters', isVegetarian: true, image: '/images/TruffleMushroom-Arancini.png' },
      { name: 'Spicy Wagyu Carpaccio', price: 780, category: 'Starters', isSpicy: true, image: '/images/SpicyWagyuCarpaccio.png' },
      { name: 'Pan-Seared Hokkaido Scallops', price: 850, category: 'Starters', image: '/images/Pan-SearedHokkaidoScallops.png' },
      { name: 'A5 Wagyu Beef Tenderloin', price: 3500, category: 'Mains', image: '/images/A5WagyuBeefTenderloin.png' },
      { name: 'Maine Lobster Ravioli', price: 1450, category: 'Mains', image: '/images/MaineLobsterRavioli.png' },
      { name: 'Spicy Blue Crab Tagliolini', price: 950, category: 'Mains', isSpicy: true, image: '/images/SpicyBlueCrabTagliolini.png' },
      { name: 'Mediterranean Pan-Seared Seabass', price: 980, category: 'Mains', image: '/images/Mediterranean Pan-Seared Seabass.png' },
      { name: 'Pan-Seared Duck Breast', price: 890, category: 'Mains', image: '/images/Pan-Seared Duck Breast.png' },
      { name: 'Pizza Margherita D.O.C.', price: 550, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza Margherita D.O.C..png' },
      { name: 'Pizza Black Truffle & Porcini', price: 890, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza Black Truffle & Porcini.png' },
      { name: 'Pizza Diavola & Spicy Nduja', price: 690, category: 'Artisan Pizza', isSpicy: true, image: '/images/Pizza Diavola & Spicy Nduja.png' },
      { name: 'Pizza Prosciutto di Parma & Burrata', price: 850, category: 'Artisan Pizza', image: '/images/Pizza Prosciutto di Parma & Burrata.png' },
      { name: 'Pizza 4 Formaggi & Organic Honey', price: 680, category: 'Artisan Pizza', isVegetarian: true, image: '/images/Pizza 4 Formaggi & Organic Honey.png' },
      { name: 'Pizza Spicy Seafood Marinara', price: 890, category: 'Artisan Pizza', isSpicy: true, image: '/images/Pizza Spicy Seafood Marinara.png' },
      { name: 'Signature Deconstructed Tiramisu', price: 450, category: 'Desserts', isVegetarian: true, image: '/images/Signature Deconstructed Tiramisu.png' },
      { name: 'Deconstructed Lemon Meringue Tart', price: 420, category: 'Desserts', isVegetarian: true, image: '/images/Deconstructed Lemon Meringue Tart.png' },
      { name: 'Warm Belgian Chocolate Lava Cake', price: 480, category: 'Desserts', isVegetarian: true, image: '/images/Warm Belgian Chocolate Lava Cake.png' },
      { name: 'Madagascar Vanilla Crème Brûlée', price: 420, category: 'Desserts', isVegetarian: true, image: '/images/Madagascar Vanilla Crème Brûlée.png' },
      { name: 'Ruby Signature Cocktail', price: 550, category: 'Drinks', isVegetarian: true, image: '/images/Ruby Signature Cocktail.png' },
      { name: 'Smoked Rosemary Old Fashioned', price: 620, category: 'Drinks', isVegetarian: true, image: '/images/Smoked Rosemary Old Fashioned.png' },
      { name: 'Evian Mineral Water', price: 150, category: 'Drinks', isVegetarian: true, image: '/images/Evian Mineral Water.png' },
      { name: 'Tokyo Sour', price: 480, category: 'Drinks', isVegetarian: true, image: '/images/Tokyo Sour.png' },
      { name: 'Lychee Martini', price: 450, category: 'Drinks', isVegetarian: true, image: '/images/Lychee Martini.png' },
      { name: 'Midnight Espresso Martini', price: 480, category: 'Drinks', isVegetarian: true, image: '/images/Midnight Espresso Martini.png' },
      { name: 'Sunset Aperol Spritz', price: 520, category: 'Drinks', isVegetarian: true, image: '/images/Sunset Aperol Spritz.png' },
      { name: 'Spicy Mango Margarita', price: 460, category: 'Drinks', isVegetarian: true, isSpicy: true, image: '/images/Spicy Mango Margarita.png' },
      { name: 'Alta Vigna - Cannonau di Sardegna', price: 2560, category: 'Premium Wines', isVegetarian: true, image: '/images/Alta Vigna - Cannonau di Sardegna.png' },
      { name: 'Vento Rosso - Sardinian Rosé', price: 1820, category: 'Premium Wines', isVegetarian: true, image: '/images/Vento Rosso - Sardinian Rosé wine.png' },
      { name: 'Luce Di Terra - Isola dei Nuraghi', price: 3200, category: 'Premium Wines', isVegetarian: true, image: '/images/Luce Di Terra - Isola dei Nuraghi.png' },
    ];
    await prisma.menuItem.createMany({ data: menuItems });
    res.json({ ok: true, message: `Seeded ${menuItems.length} menu items` });
  } catch (err) {
    console.error('Menu seed error:', err);
    res.status(500).json({ error: 'Menu seed failed', details: err.message });
  }
});

// Clear DB Endpoint for Render
app.post('/api/admin/clear-db', async (req, res) => {
  if (req.query.key !== 'CY36-PHASE2') return res.status(403).json({ error: 'Invalid key' });
  try {
    const prisma = (await import('./db.js')).default;
    // Delete children before users (EventInquiry & Reservation both FK -> User).
    // Keeps MenuItem (public data) intact.
    await prisma.reservation.deleteMany({});
    await prisma.eventInquiry.deleteMany({});
    await prisma.user.deleteMany({});
    // Reset sequences so new bookings/users created via the site start from 1
    await prisma.$executeRawUnsafe(`SELECT setval('"User_id_seq"', 1, false);`);
    await prisma.$executeRawUnsafe(`SELECT setval('"Reservation_id_seq"', 1, false);`);
    await prisma.$executeRawUnsafe(`SELECT setval('"EventInquiry_id_seq"', 1, false);`);
    res.json({ ok: true, message: 'Cleared all users, reservations and event inquiries (menu kept)' });
  } catch (err) {
    console.error('Clear DB error:', err);
    res.status(500).json({ error: 'Clear DB failed', details: err.message });
  }
});

// Clear logs — empties the persistent Postgres log tables (and local files if any).
// Use before starting a fresh collection run.
app.post('/api/admin/clear-logs', async (req, res) => {
  if (req.query.key !== 'CY36-PHASE2') return res.status(403).json({ error: 'Invalid key' });
  try {
    await prisma.$executeRawUnsafe('TRUNCATE access_log, ground_truth_log RESTART IDENTITY');
    // Also truncate local files if present (local docker path).
    const accessFile = path.join(__dirname, '../logs/nginx/idor_nginx.log');
    const gtFile = path.join(__dirname, '../logs/ground_truth/app_ground_truth.csv');
    if (fs.existsSync(accessFile)) fs.truncateSync(accessFile, 0);
    if (fs.existsSync(gtFile)) fs.truncateSync(gtFile, 0);
    res.json({ ok: true, message: 'Logs cleared (DB tables access_log + ground_truth_log)' });
  } catch (err) {
    console.error('Clear logs error:', err);
    res.status(500).json({ error: 'Clear logs failed', details: err.message });
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

// Ensure additive columns exist WITHOUT relying on Render's flaky runtime
// `prisma migrate deploy`. This idempotent raw ALTER runs BEFORE we accept any
// request, so the generated Prisma client never queries a column the DB lacks
// (which previously 500'd every User operation). Safe on existing tables.
async function ensureSchema() {
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "phone" TEXT');
    // Persistent log tables (raw CREATE IF NOT EXISTS — not a Prisma migration, so
    // Render's flaky runtime migrate can't leave the client querying a missing table).
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS access_log (id BIGSERIAL PRIMARY KEY, line TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now())'
    );
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS ground_truth_log (id BIGSERIAL PRIMARY KEY, ts TEXT, trace TEXT, template TEXT, object_id TEXT, owner_user_id TEXT, current_user_id TEXT, authorized INT, status INT, created_at TIMESTAMPTZ NOT NULL DEFAULT now())'
    );
    console.log('✅ Schema ensured (User.phone, access_log, ground_truth_log).');
  } catch (err) {
    console.warn('⚠️  ensureSchema failed (fresh DB? will rely on migrate deploy):', err.message);
  }
}

ensureSchema().finally(() => {
  app.listen(PORT, async () => {
    console.log(`🍽️  POS Server running on http://localhost:${PORT} (TESTBED: ${TESTBED})`);
    // migrate deploy in background — creates tables on a brand-new DB
    try {
      const { execSync } = await import('child_process');
      console.log('Running prisma migrate deploy...');
      execSync('npx prisma migrate deploy', { cwd: path.resolve(__dirname), stdio: 'inherit', timeout: 30000 });
      console.log('✅ Prisma migrate deploy completed.');
    } catch (err) {
      console.warn('⚠️  Prisma migrate deploy skipped or failed:', err.message);
    }
  });
});
