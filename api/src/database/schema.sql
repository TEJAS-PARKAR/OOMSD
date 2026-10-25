-- ============================================================================
-- FA1 3NF RELATIONAL SCHEMA: ONLINE RAILWAY RESERVATION SYSTEM
-- Course: OOMSD (BCER27PC02) | PCCoE | Faculty: Prof. Shalu Mahajan
-- Consistent with FA1 Class Diagram, ER Diagram, and 3NF Normalization
-- ============================================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS PAYMENT CASCADE;
DROP TABLE IF EXISTS RESERVATION CASCADE;
DROP TABLE IF EXISTS SEAT CASCADE;
DROP TABLE IF EXISTS COACH CASCADE;
DROP TABLE IF EXISTS TRAIN_SCHEDULE CASCADE;
DROP TABLE IF EXISTS STATION CASCADE;
DROP TABLE IF EXISTS TRAIN CASCADE;
DROP TABLE IF EXISTS PASSENGER CASCADE;

-- 1. PASSENGER (User & Admin entities as modeled in FA1)
CREATE TABLE PASSENGER (
    PassengerID VARCHAR(36) PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    Email VARCHAR(120) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL,
    Age INT NOT NULL CHECK (Age >= 1 AND Age <= 120),
    Gender VARCHAR(10) NOT NULL CHECK (Gender IN ('Male', 'Female', 'Other')),
    PasswordHash VARCHAR(255) NOT NULL,
    Role VARCHAR(20) NOT NULL DEFAULT 'Passenger' CHECK (Role IN ('Passenger', 'Admin')),
    CreatedAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STATION (Master Station Data)
CREATE TABLE STATION (
    StationCode VARCHAR(10) PRIMARY KEY,
    StationName VARCHAR(100) NOT NULL,
    City VARCHAR(60) NOT NULL,
    State VARCHAR(60) NOT NULL
);

-- 3. TRAIN (Train Master Table)
CREATE TABLE TRAIN (
    TrainNumber VARCHAR(10) PRIMARY KEY,
    TrainName VARCHAR(100) NOT NULL,
    TrainType VARCHAR(50) NOT NULL, -- Superfast, Express, Rajdhani, Vande Bharat
    TotalCoaches INT NOT NULL DEFAULT 10 CHECK (TotalCoaches > 0)
);

-- 4. TRAIN_SCHEDULE (Schedule & Route Information)
CREATE TABLE TRAIN_SCHEDULE (
    ScheduleID VARCHAR(36) PRIMARY KEY,
    TrainNumber VARCHAR(10) NOT NULL REFERENCES TRAIN(TrainNumber) ON DELETE CASCADE,
    SourceStationCode VARCHAR(10) NOT NULL REFERENCES STATION(StationCode) ON DELETE RESTRICT,
    DestinationStationCode VARCHAR(10) NOT NULL REFERENCES STATION(StationCode) ON DELETE RESTRICT,
    DepartureTime TIME NOT NULL,
    ArrivalTime TIME NOT NULL,
    JourneyDate DATE NOT NULL,
    DistanceKM INT NOT NULL CHECK (DistanceKM > 0),
    BaseFare NUMERIC(10, 2) NOT NULL DEFAULT 500.00
);

-- 5. COACH (Physical coaches attached to a train)
CREATE TABLE COACH (
    CoachID VARCHAR(36) PRIMARY KEY,
    TrainNumber VARCHAR(10) NOT NULL REFERENCES TRAIN(TrainNumber) ON DELETE CASCADE,
    CoachNumber VARCHAR(10) NOT NULL, -- e.g., 'B1', 'B2', 'A1', 'S1'
    CoachType VARCHAR(20) NOT NULL,   -- '1A', '2A', '3A', 'SL', 'CC'
    CONSTRAINT UQ_Train_CoachNumber UNIQUE (TrainNumber, CoachNumber)
);

-- 6. SEAT (Seats inside a Coach)
CREATE TABLE SEAT (
    SeatID VARCHAR(36) PRIMARY KEY,
    CoachID VARCHAR(36) NOT NULL REFERENCES COACH(CoachID) ON DELETE CASCADE,
    SeatNumber INT NOT NULL,
    BerthType VARCHAR(20) NOT NULL CHECK (BerthType IN ('Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window', 'Aisle')),
    Status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (Status IN ('AVAILABLE', 'LOCKED', 'BOOKED')),
    LockedUntil TIMESTAMP WITH TIME ZONE NULL,
    LockedBy VARCHAR(36) NULL,
    CONSTRAINT UQ_Coach_SeatNumber UNIQUE (CoachID, SeatNumber)
);

-- 7. RESERVATION (Ticket booking entity, PK = PNR as specified in FA1)
CREATE TABLE RESERVATION (
    PNR VARCHAR(10) PRIMARY KEY,
    PassengerID VARCHAR(36) NOT NULL REFERENCES PASSENGER(PassengerID) ON DELETE RESTRICT,
    ScheduleID VARCHAR(36) NOT NULL REFERENCES TRAIN_SCHEDULE(ScheduleID) ON DELETE RESTRICT,
    TrainNumber VARCHAR(10) NOT NULL REFERENCES TRAIN(TrainNumber) ON DELETE RESTRICT,
    JourneyDate DATE NOT NULL,
    TotalFare NUMERIC(10, 2) NOT NULL CHECK (TotalFare >= 0),
    BookingStatus VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (BookingStatus IN ('CONFIRMED', 'CANCELLED', 'WAITLISTED')),
    BookingDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    SeatDetails JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 8. PAYMENT (Payment entity, FK = PNR as specified in FA1)
CREATE TABLE PAYMENT (
    PaymentID VARCHAR(36) PRIMARY KEY,
    PNR VARCHAR(10) NOT NULL REFERENCES RESERVATION(PNR) ON DELETE CASCADE,
    Amount NUMERIC(10, 2) NOT NULL CHECK (Amount >= 0),
    PaymentMethod VARCHAR(30) NOT NULL CHECK (PaymentMethod IN ('UPI', 'CreditCard', 'DebitCard', 'NetBanking')),
    PaymentStatus VARCHAR(20) NOT NULL DEFAULT 'SUCCESS' CHECK (PaymentStatus IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    TransactionReference VARCHAR(64) NOT NULL UNIQUE,
    PaymentDate TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    RefundAmount NUMERIC(10, 2) DEFAULT 0.00
);

-- ============================================================================
-- PERFORMANCE INDEXES (Rubric C: Scalability and Performance)
-- ============================================================================
CREATE INDEX idx_train_schedule_lookup 
    ON TRAIN_SCHEDULE(SourceStationCode, DestinationStationCode, JourneyDate);

CREATE INDEX idx_reservation_passenger 
    ON RESERVATION(PassengerID);

CREATE INDEX idx_reservation_date 
    ON RESERVATION(JourneyDate);

CREATE INDEX idx_seat_status 
    ON SEAT(CoachID, Status);

CREATE INDEX idx_payment_pnr 
    ON PAYMENT(PNR);
