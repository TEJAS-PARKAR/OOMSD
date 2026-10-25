import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// PostgreSQL Connection Pool configuration
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/railway_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'railway_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

export let isConnectedToPostgres = false;

// Fallback in-memory database store for local quick-runs without Docker / PostgreSQL
export const inMemoryStore = {
  passengers: [
    {
      PassengerID: 'usr-admin-01',
      Name: 'Prof. Shalu Mahajan (Admin)',
      Email: 'admin@irctc.ac.in',
      Phone: '9876543210',
      Age: 40,
      Gender: 'Female',
      PasswordHash: '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', // Admin@123
      Role: 'Admin',
    },
    {
      PassengerID: 'usr-pass-01',
      Name: 'Tejas Parkar',
      Email: 'tejas@pccoe.edu.in',
      Phone: '9123456780',
      Age: 21,
      Gender: 'Male',
      PasswordHash: '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', // Pass@123
      Role: 'Passenger',
    },
    {
      PassengerID: 'usr-pass-02',
      Name: 'Pankaj Gill',
      Email: 'pankaj@pccoe.edu.in',
      Phone: '9123456781',
      Age: 21,
      Gender: 'Male',
      PasswordHash: '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq',
      Role: 'Passenger',
    },
    {
      PassengerID: 'usr-pass-03',
      Name: 'Ajim Pathan',
      Email: 'ajim@pccoe.edu.in',
      Phone: '9123456782',
      Age: 21,
      Gender: 'Male',
      PasswordHash: '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq',
      Role: 'Passenger',
    }
  ],
  stations: [
    { StationCode: 'PUNE', StationName: 'Pune Junction', City: 'Pune', State: 'Maharashtra' },
    { StationCode: 'CSMT', StationName: 'Chhatrapati Shivaji Maharaj Terminus', City: 'Mumbai', State: 'Maharashtra' },
    { StationCode: 'NDLS', StationName: 'New Delhi Railway Station', City: 'New Delhi', State: 'Delhi' },
    { StationCode: 'HWH', StationName: 'Howrah Junction', City: 'Kolkata', State: 'West Bengal' },
    { StationCode: 'SBC', StationName: 'KSR Bengaluru City', City: 'Bengaluru', State: 'Karnataka' },
  ],
  trains: [
    { TrainNumber: '12157', TrainName: 'Hutatma Express', TrainType: 'Superfast Express', TotalCoaches: 12 },
    { TrainNumber: '12124', TrainName: 'Deccan Queen Express', TrainType: 'Superfast Express', TotalCoaches: 14 },
    { TrainNumber: '22692', TrainName: 'Bengaluru Rajdhani', TrainType: 'Rajdhani Express', TotalCoaches: 18 },
    { TrainNumber: '12222', TrainName: 'Howrah Duronto Express', TrainType: 'Duronto Express', TotalCoaches: 16 },
    { TrainNumber: '20901', TrainName: 'Vande Bharat Express', TrainType: 'Vande Bharat', TotalCoaches: 16 },
  ],
  schedules: [
    { ScheduleID: 'sch-001', TrainNumber: '12157', SourceStationCode: 'PUNE', DestinationStationCode: 'CSMT', DepartureTime: '06:00:00', ArrivalTime: '09:45:00', JourneyDate: new Date().toISOString().split('T')[0], DistanceKM: 192, BaseFare: 280.00 },
    { ScheduleID: 'sch-002', TrainNumber: '12124', SourceStationCode: 'PUNE', DestinationStationCode: 'CSMT', DepartureTime: '07:15:00', ArrivalTime: '10:25:00', JourneyDate: new Date().toISOString().split('T')[0], DistanceKM: 192, BaseFare: 350.00 },
    { ScheduleID: 'sch-003', TrainNumber: '12157', SourceStationCode: 'PUNE', DestinationStationCode: 'CSMT', DepartureTime: '06:00:00', ArrivalTime: '09:45:00', JourneyDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], DistanceKM: 192, BaseFare: 280.00 },
    { ScheduleID: 'sch-004', TrainNumber: '22692', SourceStationCode: 'NDLS', DestinationStationCode: 'SBC', DepartureTime: '20:50:00', ArrivalTime: '05:20:00', JourneyDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], DistanceKM: 2365, BaseFare: 2850.00 },
    { ScheduleID: 'sch-005', TrainNumber: '12222', SourceStationCode: 'PUNE', DestinationStationCode: 'HWH', DepartureTime: '15:15:00', ArrivalTime: '20:15:00', JourneyDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], DistanceKM: 2020, BaseFare: 2400.00 },
    { ScheduleID: 'sch-006', TrainNumber: '20901', SourceStationCode: 'CSMT', DestinationStationCode: 'NDLS', DepartureTime: '05:55:00', ArrivalTime: '19:40:00', JourneyDate: new Date().toISOString().split('T')[0], DistanceKM: 1384, BaseFare: 1850.00 },
  ],
  coaches: [
    { CoachID: 'cch-001', TrainNumber: '12157', CoachNumber: 'C1', CoachType: 'CC' },
    { CoachID: 'cch-002', TrainNumber: '12157', CoachNumber: 'C2', CoachType: 'CC' },
    { CoachID: 'cch-003', TrainNumber: '12157', CoachNumber: 'D1', CoachType: '2S' },
    { CoachID: 'cch-004', TrainNumber: '12124', CoachNumber: 'D1', CoachType: 'CC' },
    { CoachID: 'cch-005', TrainNumber: '22692', CoachNumber: 'B1', CoachType: '3A' },
  ],
  seats: [
    { SeatID: 'st-001', CoachID: 'cch-001', SeatNumber: 1, BerthType: 'Window', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-002', CoachID: 'cch-001', SeatNumber: 2, BerthType: 'Middle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-003', CoachID: 'cch-001', SeatNumber: 3, BerthType: 'Aisle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-004', CoachID: 'cch-001', SeatNumber: 4, BerthType: 'Aisle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-005', CoachID: 'cch-001', SeatNumber: 5, BerthType: 'Middle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-006', CoachID: 'cch-001', SeatNumber: 6, BerthType: 'Window', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-007', CoachID: 'cch-001', SeatNumber: 7, BerthType: 'Window', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-008', CoachID: 'cch-001', SeatNumber: 8, BerthType: 'Middle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-009', CoachID: 'cch-001', SeatNumber: 9, BerthType: 'Aisle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-010', CoachID: 'cch-001', SeatNumber: 10, BerthType: 'Aisle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-011', CoachID: 'cch-001', SeatNumber: 11, BerthType: 'Middle', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
    { SeatID: 'st-012', CoachID: 'cch-001', SeatNumber: 12, BerthType: 'Window', Status: 'AVAILABLE', LockedUntil: null, LockedBy: null },
  ],
  reservations: [
    {
      PNR: 'PNR847291',
      PassengerID: 'usr-pass-01',
      ScheduleID: 'sch-001',
      TrainNumber: '12157',
      JourneyDate: new Date().toISOString().split('T')[0],
      TotalFare: 280.00,
      BookingStatus: 'CONFIRMED',
      BookingDate: new Date().toISOString(),
      SeatDetails: [{ seatId: 'st-001', seatNumber: 1, coachNumber: 'C1', berthType: 'Window', passengerName: 'Tejas Parkar' }]
    }
  ],
  payments: [
    {
      PaymentID: 'pay-001',
      PNR: 'PNR847291',
      Amount: 280.00,
      PaymentMethod: 'UPI',
      PaymentStatus: 'SUCCESS',
      TransactionReference: 'TXN_IRCTC_992102931',
      PaymentDate: new Date().toISOString(),
      RefundAmount: 0.00
    }
  ]
};

// Initialize DB schema & seed if Postgres is connected
export async function initDatabase() {
  try {
    const client = await pool.connect();
    isConnectedToPostgres = true;
    console.log('✅ Connected to PostgreSQL database successfully.');

    // Check if tables already exist
    const checkTable = await client.query(`
      SELECT to_regclass('public.reservation') AS exists;
    `);

    if (!checkTable.rows[0].exists) {
      console.log('⚡ Running FA1 3NF Schema migrations and seed data...');
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');
      const seedPath = path.join(__dirname, '..', 'database', 'seed.sql');

      if (fs.existsSync(schemaPath)) {
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        console.log('✅ Schema migration applied.');
      }
      if (fs.existsSync(seedPath)) {
        const seedSql = fs.readFileSync(seedPath, 'utf8');
        await client.query(seedSql);
        console.log('✅ Seed data inserted.');
      }
    } else {
      console.log('ℹ️ FA1 3NF schema tables are already present.');
    }
    client.release();
  } catch (err) {
    isConnectedToPostgres = false;
    console.warn(`⚠️ PostgreSQL unavailable (${err.message}). Using high-performance in-memory 3NF relational mock store for local development.`);
  }
}

// Universal Query Helper: routes to PostgreSQL when available, or executes against inMemoryStore
export async function query(text, params = []) {
  if (isConnectedToPostgres) {
    return pool.query(text, params);
  }
  // If in fallback mode, simulate result structure { rows: [...] }
  return executeInMemoryQuery(text, params);
}

function executeInMemoryQuery(sql, params) {
  const normalized = sql.trim().toUpperCase();
  
  if (normalized.startsWith('SELECT') && normalized.includes('STATION')) {
    return { rows: inMemoryStore.stations };
  }
  if (normalized.startsWith('SELECT') && normalized.includes('TRAIN_SCHEDULE')) {
    return { rows: inMemoryStore.schedules };
  }
  if (normalized.startsWith('SELECT') && normalized.includes('TRAIN')) {
    return { rows: inMemoryStore.trains };
  }
  if (normalized.startsWith('SELECT') && normalized.includes('SEAT')) {
    return { rows: inMemoryStore.seats };
  }
  if (normalized.startsWith('SELECT') && normalized.includes('RESERVATION')) {
    return { rows: inMemoryStore.reservations };
  }
  if (normalized.startsWith('SELECT') && normalized.includes('PAYMENT')) {
    return { rows: inMemoryStore.payments };
  }
  return { rows: [] };
}
