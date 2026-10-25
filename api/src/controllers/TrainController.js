import { Train } from '../models/Train.js';
import { TrainSchedule } from '../models/TrainSchedule.js';
import { Coach } from '../models/Coach.js';
import { Seat } from '../models/Seat.js';
import { cache } from '../config/redis.js';

export class TrainController {
  // Use Case: Search Train (with Cache-Aside strategy)
  static async searchTrains(req, res, next) {
    try {
      const { source, destination, date } = req.query;

      if (!source || !destination) {
        return res.status(400).json({
          success: false,
          error: 'Source and destination query parameters are required.',
          code: 400
        });
      }

      const cacheKey = `search:${source.toUpperCase()}:${destination.toUpperCase()}:${date || 'all'}`;

      // 1. Check Cache first (Cache-Aside pattern)
      const cachedResult = await cache.get(cacheKey);
      if (cachedResult) {
        return res.status(200).json({
          success: true,
          fromCache: true,
          count: cachedResult.length,
          data: cachedResult,
          replicaId: process.env.REPLICA_ID || 'API-Replica-1'
        });
      }

      // 2. Cache Miss: Query Database
      const schedules = await TrainSchedule.search({ source, destination, date });

      // 3. Populate Cache with TTL 300 seconds
      await cache.set(cacheKey, schedules, 300);

      return res.status(200).json({
        success: true,
        fromCache: false,
        count: schedules.length,
        data: schedules,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Use Case: View Train Schedule
  static async getAllSchedules(req, res, next) {
    try {
      const cacheKey = 'schedules:all';
      const cached = await cache.get(cacheKey);
      if (cached) {
        return res.status(200).json({
          success: true,
          fromCache: true,
          data: cached,
          replicaId: process.env.REPLICA_ID || 'API-Replica-1'
        });
      }

      const schedules = await TrainSchedule.getAll();
      await cache.set(cacheKey, schedules, 300);

      return res.status(200).json({
        success: true,
        fromCache: false,
        data: schedules,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Get Coaches for Train
  static async getCoaches(req, res, next) {
    try {
      const { trainNumber } = req.params;
      const coaches = await Coach.getByTrain(trainNumber);
      return res.status(200).json({
        success: true,
        data: coaches,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Check Seat Availability (Live DB query: live seats are NOT cached as per Rubric C)
  static async getSeats(req, res, next) {
    try {
      const { coachId } = req.params;
      const seats = await Seat.getByCoach(coachId);
      return res.status(200).json({
        success: true,
        fromCache: false, // Explicitly false per Rubric C instruction
        data: seats,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Cache Diagnostics endpoint for viva & demo
  static async getCacheDiagnostics(req, res) {
    const stats = cache.getStats();
    return res.status(200).json({
      success: true,
      strategy: 'Cache-Aside with TTL (300s)',
      cachedResources: ['STATION list', 'TRAIN search results', 'TRAIN_SCHEDULES'],
      uncachedResources: ['SEAT live availability', 'PAYMENTS', 'RESERVATIONS'],
      metrics: stats,
      replicaId: process.env.REPLICA_ID || 'API-Replica-1'
    });
  }
}
