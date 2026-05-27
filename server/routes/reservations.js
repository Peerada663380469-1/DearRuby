import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sendBookingConfirmation } from '../services/emailService.js';
import sanitizeHtml from 'sanitize-html';

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/reservations - Create a new reservation (PUBLIC)
router.post('/', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'] || 'Unknown';
  console.log(`--> Received POST /api/reservations from IP: ${clientIp} | Agent: ${userAgent}`);
  console.log("--> Data:", req.body);
  try {
    const { 
      firstName, lastName, email, phone, date, time, guests, specialRequests,
      serviceType, dietary, birthday, preOrderJson
    } = req.body;
    
    if (!firstName || !lastName || !email || !phone || !date || !time || !guests) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Basic Input Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return res.status(400).json({ error: 'Invalid email format' });
    if (phone.length > 20) return res.status(400).json({ error: 'Phone number too long' });
    if (specialRequests && specialRequests.length > 500) return res.status(400).json({ error: 'Special requests too long' });
    if (dietary && dietary.length > 500) return res.status(400).json({ error: 'Dietary requirements too long' });

    let validatedPreOrder = null;
    if (preOrderJson && Array.isArray(preOrderJson)) {
      const itemIds = preOrderJson.map(item => item.id);
      const dbItems = await prisma.menuItem.findMany({
        where: { id: { in: itemIds } }
      });
      validatedPreOrder = preOrderJson.map(clientItem => {
        const dbItem = dbItems.find(db => db.id === clientItem.id);
        if (dbItem) {
          return { ...clientItem, price: dbItem.price, name: dbItem.name };
        }
        return clientItem;
      });
    }

    const reservation = await prisma.reservation.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        date,
        time,
        guests: parseInt(guests),
        specialRequests: specialRequests ? sanitizeHtml(specialRequests) : null,
        serviceType: serviceType || null,
        dietary: dietary ? sanitizeHtml(dietary) : null,
        birthday: birthday || null,
        preOrderJson: validatedPreOrder ? JSON.stringify(validatedPreOrder) : null
      }
    });

    // Send confirmation email asynchronously
    sendBookingConfirmation(reservation).catch(err => console.error("Email send failed:", err));

    res.status(201).json({ message: 'Reservation created successfully', reservation });
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// GET /api/reservations - Get all reservations (for admin)
router.get('/', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== 'supersecret-ruby-key-2026') {
    return res.status(403).json({ error: 'Forbidden: Invalid Admin Key' });
  }

  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    });
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

export default router;
