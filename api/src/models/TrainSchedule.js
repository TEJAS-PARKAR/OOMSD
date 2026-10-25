import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class TrainSchedule {
  constructor({
    ScheduleID,
    TrainNumber,
    SourceStationCode,
    DestinationStationCode,
    DepartureTime,
    ArrivalTime,
    JourneyDate,
    DistanceKM,
    BaseFare,
    TrainName,
    TrainType
  }) {
    this.scheduleID = ScheduleID;
    this.trainNumber = TrainNumber;
    this.sourceStationCode = SourceStationCode;
    this.destinationStationCode = DestinationStationCode;
    this.departureTime = DepartureTime;
    this.arrivalTime = ArrivalTime;
    this.journeyDate = typeof JourneyDate === 'string' ? JourneyDate : (JourneyDate ? JourneyDate.toISOString().split('T')[0] : '');
    this.distanceKM = DistanceKM;
    this.baseFare = parseFloat(BaseFare);
    this.trainName = TrainName;
    this.trainType = TrainType;
  }

  static async search({ source, destination, date }) {
    if (isConnectedToPostgres) {
      const sql = `
        SELECT s.*, t.TrainName, t.TrainType
        FROM TRAIN_SCHEDULE s
        JOIN TRAIN t ON s.TrainNumber = t.TrainNumber
        WHERE UPPER(s.SourceStationCode) = UPPER($1)
          AND UPPER(s.DestinationStationCode) = UPPER($2)
          AND s.JourneyDate = $3::date
        ORDER BY s.DepartureTime ASC
      `;
      const res = await query(sql, [source, destination, date]);
      return res.rows.map((r) => new TrainSchedule(r));
    }

    // In-memory query
    const results = inMemoryStore.schedules
      .filter((s) => 
        s.SourceStationCode.toUpperCase() === source.toUpperCase() &&
        s.DestinationStationCode.toUpperCase() === destination.toUpperCase() &&
        (!date || s.JourneyDate === date)
      )
      .map((s) => {
        const tr = inMemoryStore.trains.find((t) => t.TrainNumber === s.TrainNumber) || {};
        return new TrainSchedule({ ...s, TrainName: tr.TrainName, TrainType: tr.TrainType });
      });

    return results;
  }

  static async getById(scheduleId) {
    if (isConnectedToPostgres) {
      const sql = `
        SELECT s.*, t.TrainName, t.TrainType
        FROM TRAIN_SCHEDULE s
        JOIN TRAIN t ON s.TrainNumber = t.TrainNumber
        WHERE s.ScheduleID = $1
      `;
      const res = await query(sql, [scheduleId]);
      return res.rows[0] ? new TrainSchedule(res.rows[0]) : null;
    }
    const found = inMemoryStore.schedules.find((s) => s.ScheduleID === scheduleId);
    if (!found) return null;
    const tr = inMemoryStore.trains.find((t) => t.TrainNumber === found.TrainNumber) || {};
    return new TrainSchedule({ ...found, TrainName: tr.TrainName, TrainType: tr.TrainType });
  }

  static async getAll() {
    if (isConnectedToPostgres) {
      const sql = `
        SELECT s.*, t.TrainName, t.TrainType
        FROM TRAIN_SCHEDULE s
        JOIN TRAIN t ON s.TrainNumber = t.TrainNumber
        ORDER BY s.JourneyDate DESC, s.DepartureTime ASC
      `;
      const res = await query(sql);
      return res.rows.map((r) => new TrainSchedule(r));
    }
    return inMemoryStore.schedules.map((s) => {
      const tr = inMemoryStore.trains.find((t) => t.TrainNumber === s.TrainNumber) || {};
      return new TrainSchedule({ ...s, TrainName: tr.TrainName, TrainType: tr.TrainType });
    });
  }

  static async create(scheduleData) {
    const {
      ScheduleID,
      TrainNumber,
      SourceStationCode,
      DestinationStationCode,
      DepartureTime,
      ArrivalTime,
      JourneyDate,
      DistanceKM,
      BaseFare
    } = scheduleData;

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO TRAIN_SCHEDULE (
          ScheduleID, TrainNumber, SourceStationCode, DestinationStationCode,
          DepartureTime, ArrivalTime, JourneyDate, DistanceKM, BaseFare
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;
      const res = await query(sql, [
        ScheduleID, TrainNumber, SourceStationCode, DestinationStationCode,
        DepartureTime, ArrivalTime, JourneyDate, DistanceKM, BaseFare
      ]);
      return new TrainSchedule(res.rows[0]);
    }

    inMemoryStore.schedules.push(scheduleData);
    return new TrainSchedule(scheduleData);
  }
}
