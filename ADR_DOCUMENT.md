# Architectural Decision Records (ADRs)
## PCCoE — OOMSD (BCER27PC02) — FA2 Project
**Faculty:** Prof. Shalu Mahajan  
**Group:** Pankaj Gill, Ajim Pathan, Tejas Parkar  

---

## ADR-001: Architecture Pattern Selection
- **Status:** Accepted
- **Context:** The Online Railway Reservation System requires supporting an assumed peak of 25,000 concurrent active users and 450 bookings per second during Tatkal rush hours, while remaining easily runnable and demonstrable via `docker compose up` for academic evaluation.
- **Options Considered:**
  1. *Pure Microservices with Database-per-Service:*
     - *Pro:* Independent deployability and localized failure domains.
     - *Con:* Requires distributed two-phase commit (2PC) or Sagas across tightly coupled 3NF tables (`TRAIN`, `SCHEDULE`, `SEAT`, `RESERVATION`, `PAYMENT`), introducing network hop latency and dual-write complexity during high-contention seat booking.
  2. *Layered Client-Server Hybrid with API Gateway & Replicas (Chosen):*
     - *Pro:* Preserves single-database ACID transactional boundaries for atomic seat locking, directly aligns with the FA1 Class Diagram, and scales horizontally via stateless container replicas behind Nginx.
     - *Con:* The relational database must be vertically provisioned or read-replicated under extreme load.
- **Decision:** Implement a Layered Client-Server Architecture using Nginx Reverse Proxy / Load Balancer, stateless Node.js/Express API replicas, and a PostgreSQL 3NF relational database.
- **Consequences:** Eliminates distributed data inconsistency; guarantees 100% atomic seat locking without saga overhead.

---

## ADR-002: Caching Strategy using Redis (Cache-Aside with TTL)
- **Status:** Accepted
- **Context:** The system exhibits a 9:1 read-to-write ratio with repetitive search queries between high-traffic city pairs (e.g., PUNE to CSMT).
- **Options Considered:**
  1. *Write-Through Caching:*
     - *Pro:* Cache is always populated synchronously during writes.
     - *Con:* Slows down ticket creation and requires complex cache invalidation logic across all replicas.
  2. *Cache-Aside (Lazy Loading) with TTL (Chosen):*
     - *Pro:* Cache is populated on-demand; resilient to cache node restarts; stale items expire automatically via TTL (300s for train searches, 600s for stations).
     - *Con:* Incurs initial cache miss query penalty on first read.
- **Decision:** Implement the Cache-Aside pattern in `api/src/config/redis.js`. Live seat availability and payment processing strictly bypass cache to ensure 100% real-time accuracy.
- **Consequences:** Offloads 90% of read traffic from PostgreSQL while guaranteeing zero phantom seat availability.

---

## ADR-003: Frontend Architecture Selection (React SPA vs. Multi-page HTML vs. HTMx)
- **Status:** Accepted
- **Context:** The UI demands complex interactive seat matrices (selecting coach, clicking individual seats, 120-second atomic lock countdown, live 409 conflict notifications, dynamic fare updates).
- **Options Considered:**
  1. *Multi-Page Vanilla HTML + JS:*
     - *Pro:* Minimal build tooling.
     - *Con:* Fragile DOM manipulation for dynamic seat grids, full-page reloads disrupt booking flow.
  2. *HTMx (Server-Driven Partial HTML Swaps):*
     - *Pro:* Low client footprint.
     - *Con:* Tightly couples server routes to HTML snippets, failing the Rubric 2 requirement for pure JSON REST APIs.
  3. *React Single-Page Application (Chosen):*
     - *Pro:* Declarative reactive component state makes real-time seat locking, timer countdowns, and instant 409 error handling fluid and seamless; cleanly consumes versioned REST endpoints.
     - *Con:* Requires a Vite build step and client JavaScript execution.
- **Decision:** Use React 18 with Vite and client-side routing.
- **Consequences:** Clean separation of concerns between client UI and versioned backend REST contracts.
