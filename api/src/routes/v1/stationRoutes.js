import { Router } from 'express';
import { StationController } from '../../controllers/StationController.js';

const router = Router();

// GET /api/v1/stations - Get all stations (Cache-Aside enabled)
router.get('/', StationController.getAllStations);

// GET /api/v1/stations/:code - Get single station
router.get('/:code', StationController.getStationByCode);

export default router;
