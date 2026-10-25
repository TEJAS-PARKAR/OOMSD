import { Router } from 'express';
import { ReservationController } from '../../controllers/ReservationController.js';

const router = Router();

// POST /api/v1/reservations - 14-Step Booking Flow (Book Ticket use case)
router.post('/', ReservationController.bookTicket);

// GET /api/v1/reservations/:pnr - Check PNR Status use case
router.get('/:pnr', ReservationController.checkPNRStatus);

// POST /api/v1/reservations/:pnr/cancel - Cancel Ticket & Process Refund
router.post('/:pnr/cancel', ReservationController.cancelTicket);

export default router;
