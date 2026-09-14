import express from 'express';
import prisma from '../db.js';
import { requireLogin, markGT } from '../middleware/ownership.js';

const router = express.Router();

// [Support] Create event inquiry
router.post('/', requireLogin, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.session.userId };
    const r = await prisma.eventInquiry.create({ data });
    res.status(201).json(r);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create event inquiry' });
  }
});

// [Support] List mine events
router.get('/mine', requireLogin, async (req, res) => {
  try {
    const r = await prisma.eventInquiry.findMany({
      where: { userId: req.session.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json(r);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// [V5] Vulnerable Event Inquiry View
router.get('/:id', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.eventInquiry.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/events/{id}', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/events/{id}', id, r.userId);
  // VULNERABLE: No ownership check
  res.json(r);
});

// [P3] Protected Event Manage
router.get('/:id/manage', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.eventInquiry.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/events/{id}/manage', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/events/{id}/manage', id, r.userId);
  
  // SECURE: Ownership check
  if (r.userId !== req.session.userId && req.session.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(r);
});

export default router;
