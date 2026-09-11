// Customer Routes — Contains INTENTIONAL IDOR vulnerabilities for security research
// ==================================================================================
// WARNING: This file is intentionally vulnerable for research/testing purposes.
// DO NOT use in production.
// ==================================================================================

import { Router } from 'express';
import prisma from '../db.js';
import { authenticateCustomer } from '../middleware/customerAuth.js';

const router = Router();

// All routes below require customer authentication (logged in)
router.use(authenticateCustomer);

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/customer/reservations
// SAFE endpoint — returns only the logged-in customer's reservations
// ─────────────────────────────────────────────────────────────────────────────
router.get('/reservations', async (req, res) => {
  try {
    const reservations = await prisma.reservation.findMany({
      where: { customerId: req.customer.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(reservations);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Failed to fetch reservations.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// [IDOR #1] GET /api/customer/reservations/:id
// VULNERABLE — Fetches any reservation by ID without checking ownership.
// A logged-in customer can view OTHER customers' reservations by changing the ID.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/reservations/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid reservation ID.' });

    // [VULNERABILITY] No check: req.customer.id === reservation.customerId
    const reservation = await prisma.reservation.findUnique({ where: { id } });
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found.' });
    }
    res.json(reservation);
  } catch (err) {
    console.error('Error fetching reservation:', err);
    res.status(500).json({ error: 'Failed to fetch reservation.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// [IDOR #2] GET /api/customer/profile/:customerId
// VULNERABLE — Returns any customer's profile by customerId parameter.
// A logged-in customer can view OTHER customers' profiles by changing the URL.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/profile/:customerId', async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    if (isNaN(customerId)) return res.status(400).json({ error: 'Invalid customer ID.' });

    // [VULNERABILITY] No check: req.customer.id === customerId
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, createdAt: true }
    });
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }
    res.json(customer);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Failed to fetch profile.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// [IDOR #3] GET /api/customer/invoices/:reservationId
// VULNERABLE — Returns invoice data for any reservation by ID.
// A logged-in customer can view OTHER customers' invoices by changing the ID.
// ─────────────────────────────────────────────────────────────────────────────
router.get('/invoices/:reservationId', async (req, res) => {
  try {
    const reservationId = parseInt(req.params.reservationId);
    if (isNaN(reservationId)) return res.status(400).json({ error: 'Invalid reservation ID.' });

    // [VULNERABILITY] No check: req.customer.id === reservation.customerId
    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { customer: { select: { firstName: true, lastName: true, email: true, phone: true } } }
    });
    if (!reservation) {
      return res.status(404).json({ error: 'Invoice not found.' });
    }

    // Build invoice response
    let preOrderItems = [];
    let subtotal = 0;
    if (reservation.preOrderJson) {
      try {
        preOrderItems = JSON.parse(reservation.preOrderJson);
        subtotal = preOrderItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
      } catch (e) { /* ignore parse errors */ }
    }
    const vat = subtotal * 0.07;
    const total = subtotal + vat;

    res.json({
      invoiceNumber: `INV-${String(reservation.id).padStart(6, '0')}`,
      reservation,
      preOrderItems,
      subtotal,
      vat,
      total,
      issuedAt: reservation.createdAt
    });
  } catch (err) {
    console.error('Error fetching invoice:', err);
    res.status(500).json({ error: 'Failed to fetch invoice.' });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/customer/reservations
// Create a new reservation linked to the logged-in customer
// ─────────────────────────────────────────────────────────────────────────────
router.post('/reservations', async (req, res) => {
  try {
    const { date, time, guests, specialRequests, serviceType, dietary, birthday, preOrderJson } = req.body;
    if (!date || !time || !guests) {
      return res.status(400).json({ error: 'Date, time, and guest count are required.' });
    }

    // Get customer details for auto-fill
    const customer = await prisma.customer.findUnique({ where: { id: req.customer.id } });

    const reservation = await prisma.reservation.create({
      data: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone || '',
        date,
        time,
        guests: parseInt(guests),
        specialRequests: specialRequests || null,
        serviceType: serviceType || null,
        dietary: dietary || null,
        birthday: birthday || null,
        preOrderJson: preOrderJson ? JSON.stringify(preOrderJson) : null,
        customerId: customer.id
      }
    });

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (err) {
    console.error('Error creating reservation:', err);
    res.status(500).json({ error: 'Failed to create reservation.' });
  }
});

export default router;
