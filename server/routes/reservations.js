import express from 'express';
import prisma from '../db.js';
import { requireLogin, markGT } from '../middleware/ownership.js';

const router = express.Router();

// [Support] Create reservation
router.post('/', requireLogin, async (req, res) => {
  try {
    const data = { ...req.body, userId: req.session.userId };
    const r = await prisma.reservation.create({ data });
    res.status(201).json(r);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// [Support] List mine (with pagination support)
router.get('/mine', requireLogin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const r = await prisma.reservation.findMany({
      where: { userId: req.session.userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    res.json(r);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// [P4] Admin view all (Role check -> 403)
router.get('/admin/reservations', requireLogin, async (req, res) => {
  if (req.session.role !== 'manager' && req.session.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const r = await prisma.reservation.findMany();
  res.json(r);
});

// [V2] Vulnerable query param lookup
router.get('/lookup', requireLogin, async (req, res) => {
  const id = parseInt(req.query.ref);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ref' });

  const r = await prisma.reservation.findUnique({ where: { id } });
  if (!r) {
    markGT(res, '/api/reservations/lookup?ref={id}', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/lookup?ref={id}', id, r.userId);
  // VULNERABLE: No ownership check
  res.json(r);
});

// [P1] Protected Edit (Ownership check -> 403)
router.get('/:id/edit', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.reservation.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/reservations/{id}/edit', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/{id}/edit', id, r.userId);
  
  // SECURE: Ownership check
  if (r.userId !== req.session.userId && req.session.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  res.json(r);
});

// [P2] Protected Cancel (Ownership check -> 403)
router.post('/:id/cancel', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.reservation.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/reservations/{id}/cancel', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/{id}/cancel', id, r.userId);
  
  // SECURE: Ownership check
  if (r.userId !== req.session.userId && req.session.role !== 'manager') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  const updated = await prisma.reservation.update({
    where: { id },
    data: { status: 'cancelled' }
  });
  res.json(updated);
});

// [V3] Vulnerable Preorder nested path
router.get('/:id/preorder', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.reservation.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/reservations/{id}/preorder', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/{id}/preorder', id, r.userId);
  // VULNERABLE: No ownership check
  res.json({ preOrderJson: r.preOrderJson || '{}' });
});

// [V4] Vulnerable Receipt PDF format path
router.get('/:id/receipt.pdf', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.reservation.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/reservations/{id}/receipt.pdf', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/{id}/receipt.pdf', id, r.userId);
  // VULNERABLE: No ownership check
  let preOrderItems = [];
  try {
    if (r.preOrderJson) preOrderItems = JSON.parse(r.preOrderJson);
  } catch (e) {}
  
  let subtotal = 0;
  preOrderItems.forEach(item => {
    subtotal += (item.price || 0) * (item.quantity || 1);
  });
  const vat = subtotal * 0.07;
  const total = subtotal + vat;

  res.json({
    invoiceNumber: `INV-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}-${String(r.id).padStart(4, '0')}`,
    issuedAt: r.createdAt,
    reservation: {
      firstName: r.firstName,
      lastName: r.lastName,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests
    },
    preOrderItems,
    subtotal,
    vat,
    total,
    pdfData: 'mock_pdf_binary_content_for_reservation_' + id
  });
});

// [V1] Vulnerable direct ID path (Must be last to not shadow other routes)
router.get('/:id', requireLogin, async (req, res) => {
  const id = parseInt(req.params.id);
  const r = await prisma.reservation.findUnique({ where: { id } });
  
  if (!r) {
    markGT(res, '/api/reservations/{id}', id, null);
    return res.status(404).json({ error: 'Not found' });
  }
  
  markGT(res, '/api/reservations/{id}', id, r.userId);
  // VULNERABLE: No ownership check
  res.json(r);
});

export default router;
