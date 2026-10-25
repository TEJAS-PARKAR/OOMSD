import { query, inMemoryStore, isConnectedToPostgres } from '../config/database.js';
import bcrypt from 'bcryptjs';

export class Passenger {
  constructor({ PassengerID, Name, Email, Phone, Age, Gender, PasswordHash, Role = 'Passenger' }) {
    this.passengerID = PassengerID;
    this.name = Name;
    this.email = Email;
    this.phone = Phone;
    this.age = Age;
    this.gender = Gender;
    this.passwordHash = PasswordHash;
    this.role = Role;
  }

  static async findByEmail(email) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM PASSENGER WHERE Email = $1', [email]);
      return res.rows[0] ? new Passenger(res.rows[0]) : null;
    }
    const found = inMemoryStore.passengers.find((p) => p.Email.toLowerCase() === email.toLowerCase());
    return found ? new Passenger(found) : null;
  }

  static async findById(id) {
    if (isConnectedToPostgres) {
      const res = await query('SELECT * FROM PASSENGER WHERE PassengerID = $1', [id]);
      return res.rows[0] ? new Passenger(res.rows[0]) : null;
    }
    const found = inMemoryStore.passengers.find((p) => p.PassengerID === id);
    return found ? new Passenger(found) : null;
  }

  static async create({ PassengerID, Name, Email, Phone, Age, Gender, Password, Role = 'Passenger' }) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(Password, salt);

    if (isConnectedToPostgres) {
      const res = await query(
        `INSERT INTO PASSENGER (PassengerID, Name, Email, Phone, Age, Gender, PasswordHash, Role)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [PassengerID, Name, Email, Phone, Age, Gender, hash, Role]
      );
      return new Passenger(res.rows[0]);
    }

    const newPass = {
      PassengerID,
      Name,
      Email,
      Phone,
      Age: parseInt(Age, 10),
      Gender,
      PasswordHash: hash,
      Role,
    };
    inMemoryStore.passengers.push(newPass);
    return new Passenger(newPass);
  }

  async verifyPassword(password) {
    // If hashed with bcrypt
    if (this.passwordHash.startsWith('$2a$') || this.passwordHash.startsWith('$2b$')) {
      const isMatch = await bcrypt.compare(password, this.passwordHash);
      if (isMatch) return true;
    }
    // Simple fallback check for demo convenience
    if (password === 'Admin@123' && this.role === 'Admin') return true;
    if (password === 'Pass@123' && this.role === 'Passenger') return true;
    return false;
  }
}
