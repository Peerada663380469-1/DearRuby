import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, '../logs/ground_truth');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const stream = fs.createWriteStream(path.join(logDir, 'app_ground_truth.csv'), { flags: 'a' });

export function groundTruth(req, res, next) {
  res.on('finish', () => {
    const gt = res.locals.gt;
    if (!gt) return;                    // request without object id -> do not log
    const currentUserId = req.session?.userId ?? null;
    const authorized = gt.ownerUserId === null ? 1
                     : (gt.ownerUserId === currentUserId ? 1 : 0);
    stream.write([
      new Date().toISOString(),
      req.session?.trace ?? '-',
      gt.template,
      gt.objectId,
      gt.ownerUserId ?? '-',
      currentUserId ?? '-',
      authorized,
      res.statusCode
    ].join(',') + '\n');
  });
  next();
}
