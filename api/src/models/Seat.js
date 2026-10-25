import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Seat {
  constructor({ SeatID, CoachID, SeatNumber, BerthType, Status = 'AVAILABLE', LockedUntil = null, LockedBy = null }) {
    this.seatID = SeatID;
    this.coachID = CoachID;
    this.seatNumber = SeatNumber;
    this.berthType = BerthType;
    this.status = Status;
    this.lockedUntil = LockedUntil;
    this.lockedBy = LockedBy;
  }

  static async getByCoach(coachId) {
    if (isConnectedToPostgres) {
      // Release any locks that have expired
      await query(
        `UPDATE SEAT 
         SET Status = 'AVAILABLE', LockedUntil = NULL, LockedBy = NULL 
         WHERE Status = 'LOCKED' AND LockedUntil < CURRENT_TIMESTAMP`
      );

      const res = await query('SELECT * FROM SEAT WHERE CoachID = $1 ORDER BY SeatNumber ASC', [coachId]);
      return res.rows.map((r) => new Seat(r));
    }

    // In-memory update of expired locks
    const now = Date.now();
    inMemoryStore.seats.forEach((s) => {
      if (s.Status === 'LOCKED' && s.LockedUntil && new Date(s.LockedUntil).getTime() < now) {
        s.Status = 'AVAILABLE';
        s.LockedUntil = null;
        s.LockedBy = null;
      }
    });

    return inMemoryStore.seats
      .filter((s) => s.CoachID === coachId)
      .map((s) => new Seat(s));
  }

  static async lockSeat(seatId, userId, lockDurationSeconds = 120) {
    const lockExpiry = new Date(Date.now() + lockDurationSeconds * 1000);

    if (isConnectedToPostgres) {
      // Atomic compare-and-swap / conditional update in PostgreSQL
      const sql = `
        UPDATE SEAT
        SET Status = 'LOCKED',
            LockedUntil = $1,
            LockedBy = $2
        WHERE SeatID = $3
          AND (
            Status = 'AVAILABLE' 
            OR (Status = 'LOCKED' AND LockedUntil < CURRENT_TIMESTAMP)
            OR (Status = 'LOCKED' AND LockedBy = $2)
          )
        RETURNING *
      `;
      const res = await query(sql, [lockExpiry, userId, seatId]);
      if (res.rows.length === 0) {
        // Seat is already locked by someone else or booked
        const conflictCheck = await query('SELECT * FROM SEAT WHERE SeatID = $1', [seatId]);
        const currentSeat = conflictCheck.rows[0];
        const statusDesc = currentSeat ? currentSeat.status : 'UNKNOWN';
        const err = new Error(`Seat ${seatId} conflict: Current status is ${statusDesc}. Cannot acquire lock.`);
        err.statusCode = 409;
        throw err;
      }
      return new Seat(res.rows[0]);
    }

    // In-memory atomic check
    const seat = inMemoryStore.seats.find((s) => s.SeatID === seatId);
    if (!seat) {
      const err = new Error(`Seat ${seatId} not found.`);
      err.statusCode = 404;
      throw err;
    }

    const isAvailable = seat.Status === 'AVAILABLE';
    const isExpiredLock = seat.Status === 'LOCKED' && seat.LockedUntil && new Date(seat.LockedUntil).getTime() < Date.now();
    const isOwnerLock = seat.Status === 'LOCKED' && seat.LockedBy === userId;

    if (!isAvailable && !isExpiredLock && !isOwnerLock) {
      const err = new Error(`Seat conflict: Seat ${seat.SeatNumber} is currently ${seat.Status}.`);
      err.statusCode = 409;
      throw err;
    }

    seat.Status = 'LOCKED';
    seat.LockedUntil = lockExpiry.toISOString();
    seat.LockedBy = userId;
    return new Seat(seat);
  }

  static async unlockSeat(seatId, userId) {
    if (isConnectedToPostgres) {
      await query(
        `UPDATE SEAT 
         SET Status = 'AVAILABLE', LockedUntil = NULL, LockedBy = NULL 
         WHERE SeatID = $1 AND (LockedBy = $2 OR Status = 'LOCKED')`,
        [seatId, userId]
      );
      return true;
    }

    const seat = inMemoryStore.seats.find((s) => s.SeatID === seatId);
    if (seat && (seat.LockedBy === userId || seat.Status === 'LOCKED')) {
      seat.Status = 'AVAILABLE';
      seat.LockedUntil = null;
      seat.LockedBy = null;
    }
    return true;
  }

  static async markBooked(seatId) {
    if (isConnectedToPostgres) {
      await query(
        `UPDATE SEAT 
         SET Status = 'BOOKED', LockedUntil = NULL, LockedBy = NULL 
         WHERE SeatID = $1`,
        [seatId]
      );
      return true;
    }

    const seat = inMemoryStore.seats.find((s) => s.SeatID === seatId);
    if (seat) {
      seat.Status = 'BOOKED';
      seat.LockedUntil = null;
      seat.LockedBy = null;
    }
    return true;
  }

  static async markAvailable(seatId) {
    if (isConnectedToPostgres) {
      await query(
        `UPDATE SEAT 
         SET Status = 'AVAILABLE', LockedUntil = NULL, LockedBy = NULL 
         WHERE SeatID = $1`,
        [seatId]
      );
      return true;
    }

    const seat = inMemoryStore.seats.find((s) => s.SeatID === seatId);
    if (seat) {
      seat.Status = 'AVAILABLE';
      seat.LockedUntil = null;
      seat.LockedBy = null;
    }
    return true;
  }
}
