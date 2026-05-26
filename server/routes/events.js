import { Router } from 'express';
import prisma from '../db.js';
import { sendEventInquiryNotification } from '../services/emailService.js';
import sanitizeHtml from 'sanitize-html';

const router = Router();

// GET /api/events/inquiries (Protected by Admin Key)
router.get('/inquiries', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'supersecret-ruby-key-2026') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const inquiries = await prisma.eventInquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// POST /api/events/inquiry
router.post('/inquiry', async (req, res) => {
  const { firstName, lastName, email, phone, guestCount, eventDate, eventDetails } = req.body;
  if (!firstName || !lastName || !email || !phone || !guestCount || !eventDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Basic Input Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
  if (phone.length > 20) return res.status(400).json({ error: 'Phone number too long' });
  if (eventDetails && eventDetails.length > 500) return res.status(400).json({ error: 'Event details too long' });

  try {
    const inquiry = await prisma.eventInquiry.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        guestCount: Number(guestCount),
        eventDate,
        eventDetails: eventDetails ? sanitizeHtml(eventDetails) : ''
      }
    });

    sendEventInquiryNotification(inquiry).catch(err => console.error("Event email failed:", err));

    res.json(inquiry);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
