import { Router } from 'express';
import { TrainController } from '../../controllers/TrainController.js';

const router = Router();

// GET /api/v1/schedules/search?source=PUNE&destination=CSMT&date=2026-10-25
router.get('/search', TrainController.searchTrains);

// GET /api/v1/schedules - Get all schedules
router.get('/', TrainController.getAllSchedules);

export default router;
