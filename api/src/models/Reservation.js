import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Reservation {
  constructor({
    PNR,
    PassengerID,
    ScheduleID,
    TrainNumber,
    JourneyDate,
    TotalFare,
    BookingStatus = 'CONFIRMED',
    BookingDate,
    SeatDetails = [],
    PassengerName,
    PassengerEmail,
    TrainName,
    SourceStationCode,
    DestinationStationCode,
    DepartureTime,
    ArrivalTime
  }) {
    this.pnr = PNR;
    this.passengerID = PassengerID;
    this.scheduleID = ScheduleID;
    this.trainNumber = TrainNumber;
    this.journeyDate = typeof JourneyDate === 'string' ? JourneyDate : (JourneyDate ? JourneyDate.toISOString().split('T')[0] : '');
    this.totalFare = parseFloat(TotalFare);
    this.bookingStatus = BookingStatus;
    this.bookingDate = BookingDate || new Date().toISOString();
    this.seatDetails = typeof SeatDetails === 'string' ? JSON.parse(SeatDetails) : SeatDetails;
    this.passengerName = PassengerName;
    this.passengerEmail = PassengerEmail;
    this.trainName = TrainName;
    this.sourceStationCode = SourceStationCode;
    this.destinationStationCode = DestinationStationCode;
    this.departureTime = DepartureTime;
    this.arrivalTime = ArrivalTime;
  }

  static async findByPNR(pnr) {
    const cleanPnr = pnr.trim().toUpperCase();

    if (isConnectedToPostgres) {
      const sql = `
        SELECT r.*, 
               p.Name as "PassengerName", p.Email as "PassengerEmail",
               t.TrainName,
               s.SourceStationCode, s.DestinationStationCode, s.DepartureTime, s.ArrivalTime
        FROM RESERVATION r
        JOIN PASSENGER p ON r.PassengerID = p.PassengerID
        JOIN TRAIN t ON r.TrainNumber = t.TrainNumber
        JOIN TRAIN_SCHEDULE s ON r.ScheduleID = s.ScheduleID
        WHERE UPPER(r.PNR) = $1
      `;
      const res = await query(sql, [cleanPnr]);
      return res.rows[0] ? new Reservation(res.rows[0]) : null;
    }

    const found = inMemoryStore.reservations.find((r) => r.PNR.toUpperCase() === cleanPnr);
    if (!found) return null;

    const pass = inMemoryStore.passengers.find((p) => p.PassengerID === found.PassengerID) || {};
    const tr = inMemoryStore.trains.find((t) => t.TrainNumber === found.TrainNumber) || {};
    const sch = inMemoryStore.schedules.find((s) => s.ScheduleID === found.ScheduleID) || {};

    return new Reservation({
      ...found,
      PassengerName: pass.Name,
      PassengerEmail: pass.Email,
      TrainName: tr.TrainName,
      SourceStationCode: sch.SourceStationCode,
      DestinationStationCode: sch.DestinationStationCode,
      DepartureTime: sch.DepartureTime,
      ArrivalTime: sch.ArrivalTime
    });
  }

  static async create(reservationData) {
    const {
      PNR,
      PassengerID,
      ScheduleID,
      TrainNumber,
      JourneyDate,
      TotalFare,
      BookingStatus = 'CONFIRMED',
      SeatDetails = []
    } = reservationData;

    const seatDetailsJson = JSON.stringify(SeatDetails);

    if (isConnectedToPostgres) {
      const sql = `
        INSERT INTO RESERVATION (
          PNR, PassengerID, ScheduleID, TrainNumber, JourneyDate, TotalFare, BookingStatus, SeatDetails
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      const res = await query(sql, [
        PNR, PassengerID, ScheduleID, TrainNumber, JourneyDate, TotalFare, BookingStatus, seatDetailsJson
      ]);
      return new Reservation(res.rows[0]);
    }

    const newRes = {
      PNR,
      PassengerID,
      ScheduleID,
      TrainNumber,
      JourneyDate,
      TotalFare: parseFloat(TotalFare),
      BookingStatus,
      BookingDate: new Date().toISOString(),
      SeatDetails
    };
    inMemoryStore.reservations.push(newRes);
    return new Reservation(newRes);
  }

  static async updateStatus(pnr, newStatus) {
    if (isConnectedToPostgres) {
      const res = await query(
        `UPDATE RESERVATION SET BookingStatus = $1 WHERE UPPER(PNR) = $2 RETURNING *`,
        [newStatus, pnr.toUpperCase()]
      );
      return res.rows[0] ? new Reservation(res.rows[0]) : null;
    }

    const found = inMemoryStore.reservations.find((r) => r.PNR.toUpperCase() === pnr.toUpperCase());
    if (found) {
      found.BookingStatus = newStatus;
      return new Reservation(found);
    }
    return null;
  }
}
