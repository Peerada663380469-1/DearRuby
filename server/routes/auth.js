import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });
    
    const pinHash = bcrypt.hashSync(password, 10);
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        pin_hash: pinHash,
        role: 'customer'
      }
    });
    
    req.session.userId = user.id;
    req.session.role = user.role;
    res.json({ id: user.id, name: user.name, role: user.role, email: user.email });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, pin } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (!user || !bcrypt.compareSync(pin, user.pin_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    req.session.userId = user.id;
    req.session.role   = user.role;
    res.json({ id: user.id, name: user.name, role: user.role });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

export default router;
