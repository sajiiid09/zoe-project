import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Placeholder payment routes — to be implemented later
router.post('/create-payment-intent', requireAuth, (req, res) => {
  res.json({
    success: false,
    message: 'Payment integration not implemented yet',
  });
});

export default router;
