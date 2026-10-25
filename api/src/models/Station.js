import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';

export class Station {
  constructor({ StationCode, StationName, City, State }) {
    this.stationCode = StationCode;
    this.stationName = StationName;
    this.city = City;
    this.state = State;
  }

  static async getAll() {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM STATION ORDER BY StationCode ASC');
      return res.rows.map((r) => new Station(r));
    }
    return inMemoryStore.stations.map((r) => new Station(r));
  }

  static async getByCode(code) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM STATION WHERE StationCode = $1', [code.toUpperCase()]);
      return res.rows[0] ? new Station(res.rows[0]) : null;
    }
    const found = inMemoryStore.stations.find((s) => s.StationCode === code.toUpperCase());
    return found ? new Station(found) : null;
  }

  static async create({ StationCode, StationName, City, State }) {
    const code = StationCode.toUpperCase();
    if (isConnectedToPostgres) {
      const res = await query(
        `INSERT INTO STATION (StationCode, StationName, City, State)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [code, StationName, City, State]
      );
      return new Station(res.rows[0]);
    }
    const newStation = { StationCode: code, StationName, City, State };
    inMemoryStore.stations.push(newStation);
    return new Station(newStation);
  }
}
