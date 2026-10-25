import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Coach {
  constructor({ CoachID, TrainNumber, CoachNumber, CoachType }) {
    this.coachID = CoachID;
    this.trainNumber = TrainNumber;
    this.coachNumber = CoachNumber;
    this.coachType = CoachType;
  }

  static async getByTrain(trainNumber) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM COACH WHERE TrainNumber = $1 ORDER BY CoachNumber ASC', [trainNumber]);
      return res.rows.map((r) => new Coach(r));
    }
    return inMemoryStore.coaches
      .filter((c) => c.TrainNumber === trainNumber)
      .map((c) => new Coach(c));
  }

  static async getById(coachId) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM COACH WHERE CoachID = $1', [coachId]);
      return res.rows[0] ? new Coach(res.rows[0]) : null;
    }
    const found = inMemoryStore.coaches.find((c) => c.CoachID === coachId);
    return found ? new Coach(found) : null;
  }

  static async create({ CoachID, TrainNumber, CoachNumber, CoachType }) {
    if (isConnectedToPostgres) {
      const res = await query(
        `INSERT INTO COACH (CoachID, TrainNumber, CoachNumber, CoachType)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [CoachID, TrainNumber, CoachNumber, CoachType]
      );
      return new Coach(res.rows[0]);
    }
    const newCoach = { CoachID, TrainNumber, CoachNumber, CoachType };
    inMemoryStore.coaches.push(newCoach);
    return new Coach(newCoach);
  }
}
