import { Router } from 'express';
import { TrainController } from '../../controllers/TrainController.js';
import { ReservationController } from '../../controllers/ReservationController.js';

const router = Router();

// GET /api/v1/seats/coaches/:coachId - Live seat availability (uncached)
router.get('/coaches/:coachId', TrainController.getSeats);

// POST /api/v1/seats/lock - Atomic seat locking with 409 conflict handling
router.post('/lock', ReservationController.lockSeat);

// POST /api/v1/seats/unlock - Release temporary seat lock
router.post('/unlock', ReservationController.unlockSeat);

export default router;
