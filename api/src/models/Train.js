import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Train {
  constructor({ TrainNumber, TrainName, TrainType, TotalCoaches }) {
    this.trainNumber = TrainNumber;
    this.trainName = TrainName;
    this.trainType = TrainType;
    this.totalCoaches = TotalCoaches;
  }

  static async getAll() {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM TRAIN ORDER BY TrainNumber ASC');
      return res.rows.map((r) => new Train(r));
    }
    return inMemoryStore.trains.map((r) => new Train(r));
  }

  static async getByNumber(trainNumber) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM TRAIN WHERE TrainNumber = $1', [trainNumber]);
      return res.rows[0] ? new Train(res.rows[0]) : null;
    }
    const found = inMemoryStore.trains.find((t) => t.TrainNumber === trainNumber);
    return found ? new Train(found) : null;
  }

  static async create({ TrainNumber, TrainName, TrainType, TotalCoaches }) {
    if (isConnectedToPostgres) {
      const res = await query(
        `INSERT INTO TRAIN (TrainNumber, TrainName, TrainType, TotalCoaches)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [TrainNumber, TrainName, TrainType, TotalCoaches]
      );
      return new Train(res.rows[0]);
    }
    const newTrain = { TrainNumber, TrainName, TrainType, TotalCoaches: parseInt(TotalCoaches, 10) };
    inMemoryStore.trains.push(newTrain);
    return new Train(newTrain);
  }
}
