// Customer JWT Authentication Middleware
// [INTENTIONALLY VULNERABLE] This middleware only verifies that a customer is logged in,
// but does NOT enforce ownership checks on the resources being accessed.
import jwt from 'jsonwebtoken';

export function authenticateCustomer(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the customer info to the request
    req.customer = { id: decoded.customerId, email: decoded.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
