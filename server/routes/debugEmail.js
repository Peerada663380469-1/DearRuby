import express from 'express';
import { sendBookingConfirmation } from '../services/emailService.js';

const router = express.Router();

router.get('/test', async (req, res) => {
  console.log('🔧 Debug endpoint hit');
  const dummy = {
    firstName: 'Debug',
    lastName: 'User',
    email: process.env.SMTP_USER || 'peeradamod43848@gmail.com',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    guests: 1,
    serviceType: 'Dine-in',
    preOrderJson: null
  };
  try {
    await sendBookingConfirmation(dummy);
    res.json({ status: 'email_sent' });
  } catch (e) {
    console.error('Debug email error:', e);
    res.status(500).json({ error: e.message });
  }
});

export default router;
