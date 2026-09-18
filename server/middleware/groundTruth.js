import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local file (docker path). On Render the durable copy is the ground_truth_log
// Postgres table written below, which survives restarts/sleeps/deploys.
const logDir = path.join(__dirname, '../../logs/ground_truth');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const csvPath = path.join(logDir, 'app_ground_truth.csv');
const needHeader = !fs.existsSync(csvPath) || fs.statSync(csvPath).size === 0;
const stream = fs.createWriteStream(csvPath, { flags: 'a' });
if (needHeader) {
  stream.write('timestamp,trace,template,object_id,owner_user_id,current_user_id,authorized,status\n');
}

export function groundTruth(req, res, next) {
  res.on('finish', () => {
    const gt = res.locals.gt;
    if (!gt) return;                    // request without object id -> do not log
    const currentUserId = req.session?.userId ?? null;
    const authorized = gt.ownerUserId === null ? 1
                     : (gt.ownerUserId === currentUserId ? 1 : 0);
    const ts = new Date().toISOString();
    const trace = req.session?.trace ?? '-';
    const objectId = String(gt.objectId);
    const owner = gt.ownerUserId ?? '-';
    const current = currentUserId ?? '-';

    // File copy (local docker analysis)
    stream.write([ts, trace, gt.template, objectId, owner, current, authorized, res.statusCode].join(',') + '\n');

    // Durable copy in Postgres (fire-and-forget; must never break the request)
    prisma.$executeRawUnsafe(
      'INSERT INTO ground_truth_log (ts, trace, template, object_id, owner_user_id, current_user_id, authorized, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      ts, trace, gt.template, objectId, String(owner), String(current), authorized, res.statusCode
    ).catch(() => {});
  });
  next();
}
