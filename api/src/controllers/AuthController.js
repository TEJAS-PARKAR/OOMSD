import jwt from 'jsonwebtoken';
import { Passenger } from '../models/Passenger.js';
import { JWT_SECRET } from '../middlewares/authMiddleware.js';
import { v4 as uuidv4 } from 'uuid';

export class AuthController {
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required.',
          code: 400
        });
      }

      const passenger = await Passenger.findByEmail(email);
      if (!passenger) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password credentials.',
          code: 401
        });
      }

      const isValid = await passenger.verifyPassword(password);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password credentials.',
          code: 401
        });
      }

      // Generate JWT
      const token = jwt.sign(
        {
          id: passenger.passengerID,
          name: passenger.name,
          email: passenger.email,
          role: passenger.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          id: passenger.passengerID,
          name: passenger.name,
          email: passenger.email,
          phone: passenger.phone,
          role: passenger.role
        },
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    try {
      const { name, email, phone, age, gender, password } = req.body;

      if (!name || !email || !password || !phone) {
        return res.status(422).json({
          success: false,
          error: 'Missing required passenger fields (name, email, phone, password).',
          code: 422
        });
      }

      const existing = await Passenger.findByEmail(email);
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'An account with this email address already exists.',
          code: 409
        });
      }

      const passenger = await Passenger.create({
        PassengerID: `usr-${uuidv4().substring(0, 8)}`,
        Name: name,
        Email: email,
        Phone: phone,
        Age: age || 21,
        Gender: gender || 'Other',
        Password: password,
        Role: 'Passenger'
      });

      const token = jwt.sign(
        {
          id: passenger.passengerID,
          name: passenger.name,
          email: passenger.email,
          role: passenger.role
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        success: true,
        message: 'Passenger registered successfully.',
        token,
        user: {
          id: passenger.passengerID,
          name: passenger.name,
          email: passenger.email,
          role: passenger.role
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req, res, next) {
    try {
      const user = await Passenger.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user.passengerID,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
