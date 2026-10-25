import { Train } from '../models/Train.js';
import { Station } from '../models/Station.js';
import { TrainSchedule } from '../models/TrainSchedule.js';
import { Coach } from '../models/Coach.js';
import { Seat } from '../models/Seat.js';
import { cache } from '../config/redis.js';
import { v4 as uuidv4 } from 'uuid';

export class AdminController {
  // Add Train
  static async addTrain(req, res, next) {
    try {
      const { trainNumber, trainName, trainType, totalCoaches } = req.body;
      if (!trainNumber || !trainName) {
        return res.status(400).json({ success: false, error: 'TrainNumber and TrainName are required' });
      }

      const train = await Train.create({
        TrainNumber: trainNumber,
        TrainName: trainName,
        TrainType: trainType || 'Express',
        TotalCoaches: totalCoaches || 10
      });

      await cache.del('trains:all');

      return res.status(201).json({
        success: true,
        message: `Train ${trainNumber} added successfully`,
        data: train
      });
    } catch (err) {
      next(err);
    }
  }

  // Add Station
  static async addStation(req, res, next) {
    try {
      const { stationCode, stationName, city, state } = req.body;
      if (!stationCode || !stationName) {
        return res.status(400).json({ success: false, error: 'StationCode and StationName are required' });
      }

      const station = await Station.create({
        StationCode: stationCode,
        StationName: stationName,
        City: city || 'City',
        State: state || 'State'
      });

      await cache.del('stations:all');

      return res.status(201).json({
        success: true,
        message: `Station ${stationCode} added successfully`,
        data: station
      });
    } catch (err) {
      next(err);
    }
  }

  // Add Schedule
  static async addSchedule(req, res, next) {
    try {
      const {
        trainNumber,
        sourceStationCode,
        destinationStationCode,
        departureTime,
        arrivalTime,
        journeyDate,
        distanceKM,
        baseFare
      } = req.body;

      const schedule = await TrainSchedule.create({
        ScheduleID: `sch-${uuidv4().substring(0, 8)}`,
        TrainNumber: trainNumber,
        SourceStationCode: sourceStationCode,
        DestinationStationCode: destinationStationCode,
        DepartureTime: departureTime,
        ArrivalTime: arrivalTime,
        JourneyDate: journeyDate,
        DistanceKM: distanceKM || 200,
        BaseFare: baseFare || 500
      });

      await cache.del('schedules:all');

      return res.status(201).json({
        success: true,
        message: 'Train schedule added successfully',
        data: schedule
      });
    } catch (err) {
      next(err);
    }
  }

  // Add Coach and automatically seed its seats
  static async addCoach(req, res, next) {
    try {
      const { trainNumber, coachNumber, coachType, seatCount = 12 } = req.body;
      const coachId = `cch-${uuidv4().substring(0, 8)}`;

      const coach = await Coach.create({
        CoachID: coachId,
        TrainNumber: trainNumber,
        CoachNumber: coachNumber,
        CoachType: coachType || 'CC'
      });

      const berths = ['Lower', 'Middle', 'Upper', 'Window', 'Aisle', 'Side Lower'];
      const seatsCreated = [];

      for (let i = 1; i <= seatCount; i++) {
        const seatId = `st-${uuidv4().substring(0, 8)}`;
        const berthType = berths[(i - 1) % berths.length];
        
        // Directly add seat
        const newSeat = new Seat({
          SeatID: seatId,
          CoachID: coachId,
          SeatNumber: i,
          BerthType: berthType,
          Status: 'AVAILABLE'
        });
        seatsCreated.push(newSeat);
      }

      return res.status(201).json({
        success: true,
        message: `Coach ${coachNumber} and ${seatCount} seats added successfully`,
        data: {
          coach,
          seatsCreated: seatsCreated.length
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
