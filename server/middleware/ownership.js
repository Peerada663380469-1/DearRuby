export function markGT(res, template, objectId, ownerUserId) {
  res.locals.gt = { template, objectId, ownerUserId };
}

export function requireLogin(req, res, next) {
  if (!req.session?.userId) {
    return res.status(401).json({ error: 'Login required' });
  }
  next();
}
