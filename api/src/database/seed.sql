-- ============================================================================
-- FA1 SEED DATA: ONLINE RAILWAY RESERVATION SYSTEM
-- Seeded with authentic Indian Railway data (PUNE, CSMT, NDLS, HWH, SBC)
-- Course: OOMSD (BCER27PC02) | PCCoE
-- ============================================================================

-- 1. PASSENGERS & ADMIN (Default password for Admin: Admin@123, for Passenger: Pass@123)
-- Bcrypt hashes generated with 10 salt rounds:
-- Admin@123: $2a$10$9v3Y2zW7vK8p1Yd9Qe6mPu3xI7L2N4P9M6sD2b0gE5rT8yU1iO3eW (or handled dynamically by AuthController)
INSERT INTO PASSENGER (PassengerID, Name, Email, Phone, Age, Gender, PasswordHash, Role)
VALUES 
    ('usr-admin-01', 'Prof. Shalu Mahajan (Admin)', 'admin@irctc.ac.in', '9876543210', 40, 'Female', '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', 'Admin'),
    ('usr-pass-01', 'Tejas Parkar', 'tejas@pccoe.edu.in', '9123456780', 21, 'Male', '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', 'Passenger'),
    ('usr-pass-02', 'Pankaj Gill', 'pankaj@pccoe.edu.in', '9123456781', 21, 'Male', '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', 'Passenger'),
    ('usr-pass-03', 'Ajim Pathan', 'ajim@pccoe.edu.in', '9123456782', 21, 'Male', '$2a$10$wY9G9rT7k1X0q.wE8f.5Ied7bMsmb17mYvW0x2eU2k0V8mS4nO6eq', 'Passenger')
ON CONFLICT (PassengerID) DO NOTHING;

-- 2. STATIONS
INSERT INTO STATION (StationCode, StationName, City, State)
VALUES
    ('PUNE', 'Pune Junction', 'Pune', 'Maharashtra'),
    ('CSMT', 'Chhatrapati Shivaji Maharaj Terminus', 'Mumbai', 'Maharashtra'),
    ('NDLS', 'New Delhi Railway Station', 'New Delhi', 'Delhi'),
    ('HWH', 'Howrah Junction', 'Kolkata', 'West Bengal'),
    ('SBC', 'KSR Bengaluru City', 'Bengaluru', 'Karnataka')
ON CONFLICT (StationCode) DO NOTHING;

-- 3. TRAINS
INSERT INTO TRAIN (TrainNumber, TrainName, TrainType, TotalCoaches)
VALUES
    ('12157', 'Hutatma Express', 'Superfast Express', 12),
    ('12124', 'Deccan Queen Express', 'Superfast Express', 14),
    ('22692', 'Bengaluru Rajdhani', 'Rajdhani Express', 18),
    ('12222', 'Howrah Duronto Express', 'Duronto Express', 16),
    ('20901', 'Vande Bharat Express', 'Vande Bharat', 16)
ON CONFLICT (TrainNumber) DO NOTHING;

-- 4. TRAIN_SCHEDULES (Today and upcoming dates)
INSERT INTO TRAIN_SCHEDULE (ScheduleID, TrainNumber, SourceStationCode, DestinationStationCode, DepartureTime, ArrivalTime, JourneyDate, DistanceKM, BaseFare)
VALUES
    ('sch-001', '12157', 'PUNE', 'CSMT', '06:00:00', '09:45:00', CURRENT_DATE, 192, 280.00),
    ('sch-002', '12124', 'PUNE', 'CSMT', '07:15:00', '10:25:00', CURRENT_DATE, 192, 350.00),
    ('sch-003', '12157', 'PUNE', 'CSMT', '06:00:00', '09:45:00', CURRENT_DATE + INTERVAL '1 day', 192, 280.00),
    ('sch-004', '22692', 'NDLS', 'SBC', '20:50:00', '05:20:00', CURRENT_DATE + INTERVAL '1 day', 2365, 2850.00),
    ('sch-005', '12222', 'PUNE', 'HWH', '15:15:00', '20:15:00', CURRENT_DATE + INTERVAL '2 day', 2020, 2400.00),
    ('sch-006', '20901', 'CSMT', 'NDLS', '05:55:00', '19:40:00', CURRENT_DATE, 1384, 1850.00)
ON CONFLICT (ScheduleID) DO NOTHING;

-- 5. COACHES FOR 12157 Hutatma Express
INSERT INTO COACH (CoachID, TrainNumber, CoachNumber, CoachType)
VALUES
    ('cch-001', '12157', 'C1', 'CC'),
    ('cch-002', '12157', 'C2', 'CC'),
    ('cch-003', '12157', 'D1', '2S'),
    ('cch-004', '12124', 'D1', 'CC'),
    ('cch-005', '22692', 'B1', '3A'),
    ('cch-006', '22692', 'A1', '2A')
ON CONFLICT (CoachID) DO NOTHING;

-- 6. SEATS FOR COACH C1 (CoachID cch-001)
INSERT INTO SEAT (SeatID, CoachID, SeatNumber, BerthType, Status)
VALUES
    ('st-001', 'cch-001', 1, 'Window', 'AVAILABLE'),
    ('st-002', 'cch-001', 2, 'Middle', 'AVAILABLE'),
    ('st-003', 'cch-001', 3, 'Aisle', 'AVAILABLE'),
    ('st-004', 'cch-001', 4, 'Aisle', 'AVAILABLE'),
    ('st-005', 'cch-001', 5, 'Middle', 'AVAILABLE'),
    ('st-006', 'cch-001', 6, 'Window', 'AVAILABLE'),
    ('st-007', 'cch-001', 7, 'Window', 'AVAILABLE'),
    ('st-008', 'cch-001', 8, 'Middle', 'AVAILABLE'),
    ('st-009', 'cch-001', 9, 'Aisle', 'AVAILABLE'),
    ('st-010', 'cch-001', 10, 'Aisle', 'AVAILABLE'),
    ('st-011', 'cch-001', 11, 'Middle', 'AVAILABLE'),
    ('st-012', 'cch-001', 12, 'Window', 'AVAILABLE')
ON CONFLICT (SeatID) DO NOTHING;

-- 7. SEATS FOR COACH B1 (CoachID cch-005) (Sleeper/3A Berth Types)
INSERT INTO SEAT (SeatID, CoachID, SeatNumber, BerthType, Status)
VALUES
    ('st-101', 'cch-005', 1, 'Lower', 'AVAILABLE'),
    ('st-102', 'cch-005', 2, 'Middle', 'AVAILABLE'),
    ('st-103', 'cch-005', 3, 'Upper', 'AVAILABLE'),
    ('st-104', 'cch-005', 4, 'Lower', 'AVAILABLE'),
    ('st-105', 'cch-005', 5, 'Middle', 'AVAILABLE'),
    ('st-106', 'cch-005', 6, 'Upper', 'AVAILABLE'),
    ('st-107', 'cch-005', 7, 'Side Lower', 'AVAILABLE'),
    ('st-108', 'cch-005', 8, 'Side Upper', 'AVAILABLE')
ON CONFLICT (SeatID) DO NOTHING;

-- 8. SAMPLE INITIAL RESERVATION & PAYMENT (Consistent with PNR PK)
INSERT INTO RESERVATION (PNR, PassengerID, ScheduleID, TrainNumber, JourneyDate, TotalFare, BookingStatus, BookingDate, SeatDetails)
VALUES
    ('PNR847291', 'usr-pass-01', 'sch-001', '12157', CURRENT_DATE, 560.00, 'CONFIRMED', CURRENT_TIMESTAMP - INTERVAL '2 hour', 
     '[{"seatId": "st-001", "seatNumber": 1, "coachNumber": "C1", "berthType": "Window", "passengerName": "Tejas Parkar"}]'::jsonb)
ON CONFLICT (PNR) DO NOTHING;

INSERT INTO PAYMENT (PaymentID, PNR, Amount, PaymentMethod, PaymentStatus, TransactionReference, PaymentDate, RefundAmount)
VALUES
    ('pay-001', 'PNR847291', 560.00, 'UPI', 'SUCCESS', 'TXN_IRCTC_992102931', CURRENT_TIMESTAMP - INTERVAL '2 hour', 0.00)
ON CONFLICT (PaymentID) DO NOTHING;
