import { Station } from '../models/Station.js';
import { cache } from '../config/redis.js';

export class StationController {
  static async getAllStations(req, res, next) {
    try {
      const cacheKey = 'stations:all';
      const cached = await cache.get(cacheKey);

      if (cached) {
        return res.status(200).json({
          success: true,
          fromCache: true,
          data: cached,
          replicaId: process.env.REPLICA_ID || 'API-Replica-1'
        });
      }

      const stations = await Station.getAll();
      await cache.set(cacheKey, stations, 600); // 10 minutes TTL

      return res.status(200).json({
        success: true,
        fromCache: false,
        data: stations,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  static async getStationByCode(req, res, next) {
    try {
      const { code } = req.params;
      const station = await Station.getByCode(code);
      if (!station) {
        return res.status(404).json({ success: false, error: `Station ${code} not found.`, code: 404 });
      }
      return res.status(200).json({ success: true, data: station });
    } catch (err) {
      next(err);
    }
  }
}
