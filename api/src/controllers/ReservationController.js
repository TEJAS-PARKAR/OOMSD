import { v4 as uuidv4 } from 'uuid';
import { Reservation } from '../models/Reservation.js';
import { Payment } from '../models/Payment.js';
import { Seat } from '../models/Seat.js';
import { TrainSchedule } from '../models/TrainSchedule.js';
import { Passenger } from '../models/Passenger.js';
import { PaymentGatewayAdapter } from '../patterns/adapter/PaymentGatewayAdapter.js';
import { RefundContext } from '../patterns/strategy/RefundStrategyContext.js';
import { BookingSubject } from '../patterns/observer/BookingSubject.js';
import { EmailNotificationObserver, SMSNotificationObserver, AuditLogObserver } from '../patterns/observer/Observers.js';
import { PaymentMethodFactory } from '../patterns/factory/PaymentMethodFactory.js';

// Setup Observers
const bookingSubject = new BookingSubject();
bookingSubject.attach(new EmailNotificationObserver());
bookingSubject.attach(new SMSNotificationObserver());
bookingSubject.attach(new AuditLogObserver());

// Setup Payment Adapter
const paymentAdapter = new PaymentGatewayAdapter();

export class ReservationController {
  // Step 4 & 5: Lock Seat to prevent double-booking
  static async lockSeat(req, res, next) {
    try {
      const { seatId } = req.body;
      const userId = req.user ? req.user.id : (req.body.userId || 'guest-session');

      if (!seatId) {
        return res.status(400).json({ success: false, error: 'seatId is required' });
      }

      const lockedSeat = await Seat.lockSeat(seatId, userId, 120);
      return res.status(200).json({
        success: true,
        message: `Seat ${lockedSeat.seatNumber} successfully locked for 2 minutes.`,
        data: lockedSeat,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Release locked seat if user changes mind
  static async unlockSeat(req, res, next) {
    try {
      const { seatId } = req.body;
      const userId = req.user ? req.user.id : req.body.userId;
      await Seat.unlockSeat(seatId, userId);
      return res.status(200).json({ success: true, message: 'Seat released successfully.' });
    } catch (err) {
      next(err);
    }
  }

  // Step 7 - 14: Complete 14-Step Booking Flow
  static async bookTicket(req, res, next) {
    try {
      const {
        scheduleId,
        trainNumber,
        journeyDate,
        selectedSeats, // array of { seatId, seatNumber, coachNumber, berthType, passengerName }
        paymentMethod,
        paymentDetails,
      } = req.body;

      const passengerId = req.user ? req.user.id : (req.body.passengerId || 'usr-pass-01');

      if (!scheduleId || !trainNumber || !selectedSeats || selectedSeats.length === 0) {
        return res.status(422).json({
          success: false,
          error: 'Missing mandatory reservation parameters (scheduleId, trainNumber, selectedSeats).',
          code: 422
        });
      }

      // Step 2 & 3: Validate Schedule
      const schedule = await TrainSchedule.getById(scheduleId);
      if (!schedule) {
        return res.status(404).json({ success: false, error: 'Train schedule not found.', code: 404 });
      }

      const passenger = await Passenger.findById(passengerId);

      // Validate payment method using Factory Pattern
      const processor = PaymentMethodFactory.getProcessor(paymentMethod);
      if (paymentDetails) {
        processor.validate(paymentDetails);
      }

      // Calculate total fare
      const totalFare = schedule.baseFare * selectedSeats.length;

      // Generate unique PNR (IRCTC style: PNR + 6 digits)
      const pnr = `PNR${Math.floor(100000 + Math.random() * 900000)}`;

      // Step 8 & 9: Process Payment via Adapter Pattern
      const paymentResult = await paymentAdapter.processPayment({
        pnr,
        amount: totalFare,
        paymentMethod
      });

      if (!paymentResult.success) {
        return res.status(402).json({
          success: false,
          error: 'Payment failed at external gateway. Seat lock remains temporary.',
          code: 402
        });
      }

      // Step 11: Create RESERVATION record (PK = PNR)
      const reservation = await Reservation.create({
        PNR: pnr,
        PassengerID: passengerId,
        ScheduleID: scheduleId,
        TrainNumber: trainNumber,
        JourneyDate: journeyDate || schedule.journeyDate,
        TotalFare: totalFare,
        BookingStatus: 'CONFIRMED',
        SeatDetails: selectedSeats
      });

      // Create PAYMENT record (FK = PNR)
      const paymentRecord = await Payment.create({
        PaymentID: `pay-${uuidv4().substring(0, 8)}`,
        PNR: pnr,
        Amount: totalFare,
        PaymentMethod: paymentMethod,
        PaymentStatus: 'SUCCESS',
        TransactionReference: paymentResult.transactionReference
      });

      // Step 12: Mark seats as BOOKED in SEAT table
      for (const st of selectedSeats) {
        await Seat.markBooked(st.seatId);
      }

      // Step 13: Notify Observers (Observer Pattern)
      await bookingSubject.notify('BOOKING_CONFIRMED', {
        pnr,
        passengerId,
        passengerEmail: passenger ? passenger.email : 'passenger@irctc.res',
        passengerPhone: passenger ? passenger.phone : '9876543210',
        trainNumber,
        journeyDate: reservation.journeyDate,
        totalFare,
        seats: selectedSeats
      });

      // Step 14: Return Confirmation Ticket Payload
      return res.status(201).json({
        success: true,
        message: 'Ticket successfully booked and confirmed.',
        code: 201,
        replicaId: process.env.REPLICA_ID || 'API-Replica-1',
        data: {
          pnr: reservation.pnr,
          bookingStatus: reservation.bookingStatus,
          journeyDate: reservation.journeyDate,
          totalFare: reservation.totalFare,
          trainNumber: reservation.trainNumber,
          trainName: schedule.trainName,
          sourceStation: schedule.sourceStationCode,
          destinationStation: schedule.destinationStationCode,
          departureTime: schedule.departureTime,
          arrivalTime: schedule.arrivalTime,
          passengerName: passenger ? passenger.name : selectedSeats[0]?.passengerName,
          seats: selectedSeats,
          payment: {
            method: paymentRecord.paymentMethod,
            status: paymentRecord.paymentStatus,
            transactionReference: paymentRecord.transactionReference
          }
        }
      });
    } catch (err) {
      next(err);
    }
  }

  // Check PNR Status Use Case
  static async checkPNRStatus(req, res, next) {
    try {
      const { pnr } = req.params;
      if (!pnr) {
        return res.status(400).json({ success: false, error: 'PNR parameter required', code: 400 });
      }

      const reservation = await Reservation.findByPNR(pnr);
      if (!reservation) {
        return res.status(404).json({
          success: false,
          error: `Reservation with PNR "${pnr}" not found.`,
          code: 404
        });
      }

      const payment = await Payment.findByPNR(pnr);

      return res.status(200).json({
        success: true,
        data: {
          ...reservation,
          payment: payment || null
        },
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }

  // Cancel Ticket & Process Refund Use Case (extends Cancel Ticket)
  static async cancelTicket(req, res, next) {
    try {
      const { pnr } = req.params;
      const reservation = await Reservation.findByPNR(pnr);

      if (!reservation) {
        return res.status(404).json({ success: false, error: `PNR ${pnr} not found.`, code: 404 });
      }

      if (reservation.bookingStatus === 'CANCELLED') {
        return res.status(400).json({ success: false, error: 'Ticket is already cancelled.' });
      }

      const payment = await Payment.findByPNR(pnr);
      if (!payment) {
        return res.status(404).json({ success: false, error: 'Associated payment record not found.' });
      }

      // Calculate hours until journey departure for Strategy Pattern
      const journeyDateTime = new Date(`${reservation.journeyDate}T${reservation.departureTime || '06:00:00'}`);
      const hoursUntilDeparture = Math.max(0, (journeyDateTime.getTime() - Date.now()) / (1000 * 60 * 60));

      // Select dynamic strategy
      const refundStrategy = RefundContext.selectStrategyByHours(hoursUntilDeparture);
      const refundContext = new RefundContext(refundStrategy);
      const { refundAmount, ruleApplied } = refundContext.computeRefund(reservation.totalFare);

      // Process refund via Payment Adapter
      const refundResult = await paymentAdapter.processRefund({
        pnr,
        transactionReference: payment.transactionReference,
        refundAmount
      });

      // Update Database records
      await Reservation.updateStatus(pnr, 'CANCELLED');
      await Payment.updateRefund(pnr, refundAmount, 'REFUNDED');

      // Free up seats back to AVAILABLE in SEAT table
      if (Array.isArray(reservation.seatDetails)) {
        for (const st of reservation.seatDetails) {
          if (st.seatId) {
            await Seat.markAvailable(st.seatId);
          }
        }
      }

      // Dispatch cancellation event to Observers
      await bookingSubject.notify('TICKET_CANCELLED', {
        pnr,
        passengerId: reservation.passengerID,
        passengerEmail: reservation.passengerEmail || 'tejas@pccoe.edu.in',
        passengerPhone: '9876543210',
        refundAmount,
        ruleApplied
      });

      return res.status(200).json({
        success: true,
        message: 'Ticket cancelled and refund processed successfully.',
        data: {
          pnr,
          bookingStatus: 'CANCELLED',
          originalFare: reservation.totalFare,
          refundAmount,
          ruleApplied,
          refundReference: refundResult.refundReference,
          cancellationTimestamp: new Date().toISOString()
        },
        replicaId: process.env.REPLICA_ID || 'API-Replica-1'
      });
    } catch (err) {
      next(err);
    }
  }
}
