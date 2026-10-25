# 🎬 Live Demonstration Script (8 to 10 Minutes)
## PCCoE — OOMSD (BCER27PC02) — FA2 Presentation
**Faculty:** Prof. Shalu Mahajan  
**Group Members:** Pankaj Gill, Ajim Pathan, Tejas Parkar  
**System:** Online Railway Reservation System  

---

### Timing Breakdown (Total: 9 Minutes)

```
00:00 - 01:30 | Setup, Docker Compose & Architecture Overview (Pankaj)
01:30 - 03:00 | Train Search, Caching Demonstration & Swagger UI (Pankaj)
03:00 - 05:00 | Seat Grid, Atomic Locking & 409 Conflict Handling (Ajim)
05:00 - 06:45 | 14-Step Booking Flow, Payment Adapter & PNR Generation (Tejas)
06:45 - 08:00 | Check PNR & Dynamic Strategy Refund on Cancellation (Tejas)
08:00 - 09:30 | Admin Management, Round-Robin Replica Demo & Design Docs (All)
```

---

### Step 1: Launch & Container Health (00:00 – 01:30)
**Speaker: Pankaj Gill**
1. Open terminal in `c:\PCCOE\OOMSD`.
2. Run:
   ```bash
   docker compose up --build
   ```
3. Point out that all 6 services are spinning up:
   - Nginx Ingress Reverse Proxy (`gateway` on Port 80)
   - React Frontend SPA (`frontend` on Port 3000)
   - 2 API Container Replicas (`api-replica-1` & `api-replica-2` on Port 5000)
   - PostgreSQL 16 Database with 3NF Schema & Seed Data (`db` on Port 5432)
   - Redis Key-Value Store with Cache-Aside Strategy (`redis` on Port 6379)
4. Open the browser at [http://localhost](http://localhost) (or [http://localhost:3000](http://localhost:3000)).
5. Show the active replica indicator in the top navbar (`API-Replica-1` or `API-Replica-2`).

---

### Step 2: Train Search, Redis Cache Hit & Swagger UI (01:30 – 03:00)
**Speaker: Pankaj Gill**
1. On the home screen, select:
   - Source: **Pune Junction (PUNE)**
   - Destination: **Chhatrapati Shivaji Maharaj Terminus (CSMT)**
   - Date: Today's date
2. Click **Find Trains**:
   - The first request queries PostgreSQL: observe the badge `🐘 DB Query Miss (Cached for 300s)`.
   - Click **Find Trains** again: observe the instant badge update to `⚡ Redis Cache Hit`.
   - Point out that train search results and station lists are cached with a 300s/600s TTL per Rubric C.
3. Open a new tab at [http://localhost/api/docs](http://localhost/api/docs) to show the live Swagger UI OpenAPI 3.0 documentation.
4. Show the `/schedules/search` endpoint documentation with status codes 200 and 400.

---

### Step 3: Interactive Seat Grid & 409 Conflict Simulation (03:00 – 05:00)
**Speaker: Ajim Pathan**
1. Click **Select Seat** on Train `12157 - Hutatma Express`.
2. Notice the coach tabs (`C1`, `C2`, `D1`) and the live 4-column seat layout.
3. **Double-Booking Prevention Demonstration:**
   - Click on **Seat 2 (Middle)** in Coach C1.
   - The seat turns cyan with a 2-minute temporary lock:
     > *"Seat 2 locked for 2 minutes to prevent double-booking."*
   - Open an **Incognito Window** (simulating a concurrent second passenger).
   - In Incognito, navigate to [http://localhost/seats](http://localhost/seats) for the same train.
   - Observe that Seat 2 is displayed as **Locked (Orange)**.
   - Try clicking Seat 2 in Incognito:
     > **Immediate Toast / Alert: `⚠️ 409 Conflict: Seat 2 was just locked/booked by another passenger!`**
   - Explain to Prof. Shalu: *"This proves our atomic conditional SQL lock (`UPDATE SEAT ... WHERE Status = 'AVAILABLE'`) prevents race conditions during Tatkal peak bookings."*

---

### Step 4: 14-Step Booking & Payment Adapter (05:00 – 06:45)
**Speaker: Tejas Parkar**
1. Return to the primary window with Seat 2 selected.
2. Click **Proceed to Booking**.
3. Point out the Factory Pattern options for payment:
   - **UPI / QR** (validates virtual payment address `user@okhdfcbank`)
   - **Credit Card** (validates 16-digit card number)
   - **NetBanking** (selects bank core)
4. Keep **UPI** selected and click **Pay & Confirm Ticket**.
5. The backend executes the FA1 14-Step Booking Sequence:
   - Validates schedule
   - Calls `PaymentGatewayAdapter.processPayment()`
   - Inserts into `RESERVATION` (PK = generated PNR, e.g. `PNR847291`)
   - Inserts into `PAYMENT` (FK = PNR)
   - Marks Seat 2 as `BOOKED` in `SEAT` table
   - Dispatches `BookingSubject.notify('BOOKING_CONFIRMED')` to Email, SMS, and Audit Observers!
6. Show the generated printable Ticket Confirmation card displaying the PNR, passenger name, and seat assignment.

---

### Step 5: Check PNR Status & Strategy Pattern Refund (06:45 – 08:00)
**Speaker: Tejas Parkar**
1. Navigate to **Check PNR** in the navbar.
2. Enter the newly generated PNR (or seed PNR `PNR847291`) and click **Check Status**.
3. View the live ticket details: Status = `CONFIRMED`.
4. Click **Cancel Ticket**:
   - The system triggers the **Strategy Pattern** (`RefundContext.selectStrategyByHours()`):
   - Computes hours until train departure.
   - Applies the appropriate rule (e.g. `EarlyCancellationStrategy` giving a 90% refund, or `ModerateCancellationStrategy` giving 75%).
   - Invokes `PaymentGatewayAdapter.processRefund()`.
   - Sets reservation status to `CANCELLED` and payment to `REFUNDED`.
   - Releases Seat 2 back to `AVAILABLE` in the `SEAT` table.
   - Observe the cancellation confirmation showing the calculated refund amount and rule description.

---

### Step 6: Admin Management, Load Balancing & /design Portal (08:00 – 09:30)
**All Members (Pankaj, Ajim, Tejas)**
1. Navigate to **Admin Panel** in the navbar:
   - Log in using seed Admin credentials: `admin@irctc.ac.in` / `Admin@123`.
   - Demonstrate adding a new train or schedule, which automatically invalidates the Redis search cache.
   - View the live **System & Cache Metrics** tab showing hit/miss ratios.
2. Navigate to [http://localhost/design](http://localhost/design):
   - Walk Prof. Shalu through the interactive sections:
     - **A. Architecture:** High-Level Architecture Diagram and assumed scenario numbers.
     - **B. REST API:** Resource table with HTTP status codes.
     - **C. Scalability:** Load balancer configuration, Cache-Aside strategy, DB indexing table.
     - **D. UI Approach:** Comparison matrix of HTML vs React vs HTMx.
     - **E. Design Patterns:** Code snippets & diagrams for Adapter, Strategy, Observer, Factory, and MVC.
     - **F. Quality Attributes:** Performance, scalability, security tactics, and the explicit consistency trade-off.
     - **G. UML Deployment:** Multi-node container diagram.
     - **H. Integration Trace:** 14-step trace of "Book Ticket" and naming-consistency matrix.
     - **I. ADRs:** ADR-001, ADR-002, ADR-003, and the AI Review log table.
3. Conclude with viva readiness.
