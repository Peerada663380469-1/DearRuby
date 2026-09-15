import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write to POS/logs/ground_truth so it matches the docker-mounted logs tree
// and the /api/logs/groundtruth download endpoint in server.js.
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
