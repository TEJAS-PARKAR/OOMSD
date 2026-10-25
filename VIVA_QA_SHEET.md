# 🎓 FA2 Viva Voce Preparation Sheet (15 Questions & Answers)
## Course: Object-Oriented Modeling & Software Design (BCER27PC02) — PCCoE
**Faculty In-Charge:** Prof. Shalu Mahajan  
**Group:** Pankaj Gill, Ajim Pathan, Tejas Parkar  

---

## 👤 Member 1: Pankaj Gill
**Domain:** System Architecture, API Gateway, Load Balancing, Caching & Scalability

### Q1: Why did you choose a Layered Client-Server architecture over pure Microservices for this system?
> **Answer:**  
> We evaluated pure Microservices against our assumed scenario numbers (450 peak bookings/second, 25,000 concurrent users). Decomposing the tightly related 3NF tables (`TRAIN`, `SCHEDULE`, `SEAT`, `RESERVATION`, `PAYMENT`) into separate microservices with isolated databases creates the **Dual-Write Problem** and requires distributed 2-Phase Commit (2PC) or Sagas. This adds network latency during high-contention Tatkal windows. A Layered Client-Server hybrid allows stateless API scaling behind Nginx while maintaining single-database ACID transactional guarantees for atomic seat locking.

### Q2: How does Nginx distribute incoming client traffic across the two API container replicas?
> **Answer:**  
> Nginx is configured as an Ingress Reverse Proxy and Load Balancer in `nginx/nginx.conf`. It defines an upstream block `upstream api_cluster` containing `api-replica-1:5000` and `api-replica-2:5000` using the **Round-Robin** scheduling algorithm. In case of node slowdown, Nginx fails over using `max_fails=3 fail_timeout=10s`. Nginx also injects the `X-Handled-By` response header so clients can verify which replica handled their request.

### Q3: What is the Cache-Aside pattern implemented with Redis, and why is live seat availability strictly excluded from it?
> **Answer:**  
> In Cache-Aside (Lazy Loading), the application checks Redis first (`cache.get(key)`). On a cache hit, it returns data immediately without querying the DB. On a cache miss, it reads from PostgreSQL, writes the result to Redis with a TTL (e.g., 300s for train searches, 600s for stations), and returns.  
> **Live seat availability is NEVER cached** because cached seat data can become stale within milliseconds during peak booking windows. Caching seat status would cause "phantom availability" where multiple passengers believe a seat is free, causing mass booking conflicts. Live seat queries always hit PostgreSQL directly with atomic row locks.

### Q4: What are your assumed scenario numbers, and how do they justify your horizontal scaling choices?
> **Answer:**  
> We established 5 explicit assumptions:  
> 1. Total Registered Users: 500,000  
> 2. Peak Concurrent Users: 25,000  
> 3. Peak Bookings per Second (Tatkal window): 450 bookings/sec  
> 4. Read:Write Ratio: 9:1 (90% searches, 10% bookings)  
> 5. Daily Capacity: 250 trains, 180,000 seats.  
> Because 90% of traffic is read-only, Redis shields the database from repetitive search queries. The stateless API tier is scaled horizontally across multiple Node.js replicas to handle the 25,000 concurrent HTTP handshakes.

### Q5: What role does a Content Delivery Network (CDN) play in this system?
> **Answer:**  
> A CDN (e.g. Cloudflare or AWS CloudFront) is positioned geographically close to end passengers to cache and serve static frontend assets—such as HTML files, CSS stylesheets, bundled JavaScript chunks, railway logos, and station icon SVGs. It reduces latency by offloading 70%+ of static asset bandwidth from our origin Nginx gateway, preserving backend bandwidth solely for dynamic JSON REST API transactions.

---

## 👤 Member 2: Ajim Pathan
**Domain:** Database Design, 3NF Normalization, Concurrency, Atomic Seat Locking & Storage Partitioning

### Q6: How is your database schema normalized to 3NF, and what is the primary key of the RESERVATION table?
> **Answer:**  
> The schema strictly satisfies 3NF:
> - **1NF:** All attributes are atomic (no repeating groups).
> - **2NF:** In 1NF and every non-key attribute is fully functionally dependent on the primary key (no partial dependencies). For example, coach details are in `COACH`, not repeated inside `SEAT`.
> - **3NF:** In 2NF and no transitive functional dependencies exist (non-key attributes do not depend on other non-key attributes). For instance, station names depend solely on `StationCode`, not embedded within `TRAIN_SCHEDULE`.
> In strict compliance with FA1, the primary key of `RESERVATION` is **`PNR`** (10-character unique string). `PAYMENT` references `RESERVATION` via foreign key `PNR`.

### Q7: How does your backend prevent two passengers from booking the same seat simultaneously? Explain the 409 Conflict mechanism.
> **Answer:**  
> We implement an atomic Compare-And-Swap conditional update in PostgreSQL inside `Seat.lockSeat()`:
> ```sql
> UPDATE SEAT
> SET Status = 'LOCKED', LockedUntil = NOW() + INTERVAL '2 minutes', LockedBy = $userId
> WHERE SeatID = $seatId AND (Status = 'AVAILABLE' OR (Status = 'LOCKED' AND LockedUntil < NOW()));
> ```
> If two concurrent requests arrive for the same seat, PostgreSQL executes them sequentially using internal row-level locks. The first query succeeds and updates 1 row. The second query finds 0 matching rows where `Status = 'AVAILABLE'` and immediately throws an error with HTTP status code **`409 Conflict`**. The user receives an instant alert: *"Seat conflict: Seat is currently locked/booked by another passenger."*

### Q8: Which database indexes were created, and what specific queries do they accelerate?
> **Answer:**  
> We created 4 high-impact B-Tree indexes:
> 1. `idx_train_schedule_lookup` on `TRAIN_SCHEDULE(SourceStationCode, DestinationStationCode, JourneyDate)`: Accelerates the primary search query from an O(N) full-table scan to an O(log N) index range scan.
> 2. `idx_seat_status` on `SEAT(CoachID, Status)`: Optimizes live coach availability queries and expired lock clearance.
> 3. `idx_reservation_passenger` on `RESERVATION(PassengerID)`: Accelerates passenger ticket history lookup.
> 4. `idx_payment_pnr` on `PAYMENT(PNR)`: Guarantees sub-millisecond retrieval during refund calculations.

### Q9: What is your strategy for table partitioning and sharding when booking volume exceeds 180,000 daily tickets?
> **Answer:**  
> For enterprise-scale historical volume:
> - **Range Partitioning:** We partition `RESERVATION` and `TRAIN_SCHEDULE` monthly by `JourneyDate` (e.g. `RESERVATION_2026_10`, `RESERVATION_2026_11`). Completed past journeys are stored in read-only compressed partition tables, keeping the active journey index compact inside server RAM.
> - **Horizontal Sharding:** When single-node write IOPS saturate, we shard by `TrainNumber % N` across regional database instances, since bookings for Train A never compete for database row locks with Train B.

### Q10: How does the PAYMENT table maintain referential integrity with RESERVATION?
> **Answer:**  
> In accordance with the FA1 schema, `PAYMENT` has a foreign key constraint:
> `PNR VARCHAR(10) NOT NULL REFERENCES RESERVATION(PNR) ON DELETE CASCADE`.
> A payment record cannot exist without a valid PNR. If a reservation is purged, its payment audit trail is maintained or cascaded accordingly.

---

## 👤 Member 3: Tejas Parkar
**Domain:** GoF Design Patterns, 14-Step Booking Flow, REST API Contracts & Quality Attribute Trade-offs

### Q11: How does the Adapter Pattern function in your payment gateway integration?
> **Answer:**  
> In FA1, the system interacts with an external `Payment Gateway`. External banks (e.g., Razorpay, UPI Switch, Mock Bank) expose proprietary API schemas (`executeCharge({ orderId, amt, channel })`).  
> In our code (`api/src/patterns/adapter/PaymentGatewayAdapter.js`), we defined a standard internal interface `IPaymentGateway` with `processPayment()` and `processRefund()`. The `PaymentGatewayAdapter` translates our domain parameters (`pnr`, `amount`, `paymentMethod`) into the vendor's format and normalizes the bank's response into a uniform domain object (`{ success: true, transactionReference: 'EXT_...' }`). This allows us to swap mock payment providers with real Razorpay/Stripe without modifying `ReservationController`.

### Q12: Walk through the Strategy Pattern used for calculating cancellation refunds based on departure time.
> **Answer:**  
> Indian Railways dynamically varies cancellation refund amounts based on time remaining before departure:
> - `EarlyCancellationStrategy` (>48 hours before departure): 90% refund (10% clerkage deducted).
> - `ModerateCancellationStrategy` (12 to 48 hours): 75% refund (25% deducted).
> - `LateCancellationStrategy` (4 to 12 hours): 50% refund.
> - `LastMinuteCancellationStrategy` (<4 hours): 0% refund (chart prepared).  
> In `api/src/patterns/strategy/RefundStrategyContext.js`, `RefundContext.selectStrategyByHours(hours)` inspects the train schedule departure timestamp and instantiates the correct strategy. This adheres to the **Open-Closed Principle**: new cancellation rules (such as Tatkal non-refundable rules) can be introduced by creating a new strategy class without altering cancellation logic.

### Q13: How does the Observer Pattern decouple booking and cancellation notifications from the ReservationController?
> **Answer:**  
> When a ticket is confirmed or cancelled, multiple side-effects must trigger: sending an IRCTC confirmation Email, dispatching an SMS with the PNR, and logging an audit compliance event.  
> Instead of embedding third-party notification calls in `ReservationController`, we created `BookingSubject` (`api/src/patterns/observer/BookingSubject.js`). We attach `EmailNotificationObserver`, `SMSNotificationObserver`, and `AuditLogObserver`. When `bookTicket()` or `cancelTicket()` succeeds, it calls `bookingSubject.notify('BOOKING_CONFIRMED', eventData)`. The observers execute independently without blocking or coupling the reservation controller.

### Q14: What REST API design principles did you enforce, and what HTTP status codes are returned?
> **Answer:**  
> 1. **Resource-Oriented URIs:** Nouns only (`/api/v1/stations`, `/api/v1/schedules`, `/api/v1/reservations`), no verbs in URLs.
> 2. **Explicit HTTP Verbs:** `GET` for retrieval, `POST` for creation and locking, `PATCH`/`POST` for cancellation.
> 3. **API Versioning:** `/api/v1/` prefix for backwards compatibility.
> 4. **Standard Status Codes:**
>    - `200 OK`: Successful query / update.
>    - `201 Created`: Ticket reserved / PNR generated.
>    - `400 Bad Request`: Validation failure.
>    - `401 Unauthorized`: Missing or invalid JWT.
>    - `403 Forbidden`: Non-admin trying to access admin endpoints.
>    - `404 Not Found`: PNR or Train not found.
>    - `409 Conflict`: Seat already locked/booked by another concurrent passenger.
>    - `422 Unprocessable Entity`: Missing mandatory booking fields.

### Q15: What explicit architectural trade-off did your team make between consistency and performance?
> **Answer:**  
> We made an explicit trade-off: **We prioritized Strong Consistency over Read Latency for Live Seat Availability and Booking.**  
> While train search results are aggressively cached in Redis to achieve ~5ms responses, live seat status and seat locking deliberately bypass cache and execute directly on PostgreSQL using atomic conditional row locks. This incurs a slightly higher latency (~15ms) and database write contention during Tatkal rushes, but it guarantees **100% prevention of double-booking**. In a railway reservation system, an occasional retry is acceptable, but selling the same berth twice is an unacceptable domain failure.
