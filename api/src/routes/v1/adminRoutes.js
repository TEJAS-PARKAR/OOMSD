import { Router } from 'express';
import { AdminController } from '../../controllers/AdminController.js';
import { authenticateToken, requireAdmin } from '../../middlewares/authMiddleware.js';

const router = Router();

// Secure admin routes with token & role check
router.use(authenticateToken);
router.use(requireAdmin);

// POST /api/v1/admin/trains
router.post('/trains', AdminController.addTrain);

// POST /api/v1/admin/stations
router.post('/stations', AdminController.addStation);

// POST /api/v1/admin/schedules
router.post('/schedules', AdminController.addSchedule);

// POST /api/v1/admin/coaches
router.post('/coaches', AdminController.addCoach);

export default router;
