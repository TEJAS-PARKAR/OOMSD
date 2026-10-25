import { Router } from 'express';
import { Payment } from '../../models/Payment.js';

const router = Router();

// GET /api/v1/payments/:pnr - Query payment status by PNR
router.get('/:pnr', async (req, res, next) => {
  try {
    const payment = await Payment.findByPNR(req.params.pnr);
    if (!payment) {
      return res.status(404).json({ success: false, error: 'Payment record not found for PNR', code: 404 });
    }
    return res.status(200).json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
});

export default router;
