import { Router } from 'express';
import { TrainController } from '../../controllers/TrainController.js';
import { Train } from '../../models/Train.js';

const router = Router();

// GET /api/v1/trains - Get all trains
router.get('/', async (req, res, next) => {
  try {
    const trains = await Train.getAll();
    res.status(200).json({ success: true, data: trains });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/trains/:trainNumber/coaches - Get coaches for a train
router.get('/:trainNumber/coaches', TrainController.getCoaches);

// GET /api/v1/trains/diagnostics/cache - Cache stats
router.get('/diagnostics/cache', TrainController.getCacheDiagnostics);

export default router;
