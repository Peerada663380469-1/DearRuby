import express from 'express';
import prisma from '../db.js';
import { requireLogin, markGT } from '../middleware/ownership.js';

const router = express.Router();

// [V6] Vulnerable Profile View (query param)
router.get('/', requireLogin, async (req, res) => {
  const userId = parseInt(req.query.user_id);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user_id' });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    // Note: The template for V6 doesn't specify an objectId, but it's user_id. The owner of a profile is the user themselves.
    markGT(res, '/api/profile?user_id={id}', userId, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/profile?user_id={id}', userId, userId);
  
  // VULNERABLE: No ownership check (returns another user's PII)
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  });
});

export default router;
