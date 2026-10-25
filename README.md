# Online Railway Reservation System — FA2: Design to Deployment

[![Course](https://img.shields.io/badge/Course-OOMSD%20(BCER27PC02)-blue.svg)]()
[![College](https://img.shields.io/badge/Institute-PCCoE%20Pune-orange.svg)]()
[![Faculty](https://img.shields.io/badge/Faculty-Prof.%20Shalu%20Mahajan-green.svg)]()

> **FA2 Course Project (10 Marks): "Design to Deployment" as a REAL WORKING WEBSITE**  
> **Student Group Members:**  
> 1. **Pankaj Gill**  
> 2. **Ajim Pathan**  
> 3. **Tejas Parkar**  

---

## 🚂 System Overview

This project implements the **Online Railway Reservation System** originating from the FA1 Object-Oriented Analysis & Design specifications. It transitions the system from FA1 diagrams to an enterprise-grade, distributed web platform utilizing a **Layered Client-Server MERN Architecture** (React SPA + Node.js/Express API + PostgreSQL 3NF Relational Database + Redis Cache + Nginx Load Balancer).

The website includes a live interactive **Design Documentation Portal** at `/design`, which embeds all architectural diagrams, GoF design patterns, REST tables, ADRs, and deployment blueprints directly inside the application.

---

## 🔑 Seed User & Admin Credentials

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@irctc.ac.in` | `Admin@123` | Master management of Trains, Stations, Schedules, Coaches, Seats, Cache Metrics |
| **Passenger** | `tejas@pccoe.edu.in` | `Pass@123` | Search trains, lock seats, book tickets, check PNR, cancel ticket & refund |
| **Passenger** | `pankaj@pccoe.edu.in` | `Pass@123` | Secondary passenger testing |
| **Passenger** | `ajim@pccoe.edu.in` | `Pass@123` | Concurrency & seat conflict testing |

---

## 🌐 Port & Network Mapping

| Container Service | Image / Stack | Host Port | Internal Port | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **gateway** | `nginx:alpine` | **`80`** | `80` | Ingress Reverse Proxy, Round-Robin Load Balancer, Rate Limiting (10 r/s) |
| **frontend** | `React 18 / Vite` | **`3000`** | `3000` | Single-Page Application Client (`/`, `/seats`, `/pnr`, `/admin`, `/design`) |
| **api-replica-1** | `Node 20 / Express` | — | `5000` | Stateless API Worker Node 1 (`X-Handled-By: API-Replica-1`) |
| **api-replica-2** | `Node 20 / Express` | — | `5000` | Stateless API Worker Node 2 (`X-Handled-By: API-Replica-2`) |
| **db** | `PostgreSQL 16` | **`5432`** | `5432` | 3NF Schema with atomic seat locking and transactional consistency |
| **redis** | `Redis 7 Alpine` | **`6379`** | `6379` | Cache-Aside key-value store with TTL (300s/600s) |

---

## 🚀 How to Run the Application

### Option A: One-Command Docker Compose (Standard Deployment)

```bash
# From the repository root (c:\PCCOE\OOMSD)
docker compose up --build
```

Once running:
- **Web Application:** [http://localhost](http://localhost) (via Nginx Port 80) or [http://localhost:3000](http://localhost:3000)
- **Interactive Design Documentation:** [http://localhost/design](http://localhost/design)
- **OpenAPI 3.0 Swagger UI:** [http://localhost/api/docs](http://localhost/api/docs)
- **API Health Check:** [http://localhost/api/health](http://localhost/api/health)

---

### Option B: Local Development Run (Standalone without Docker)

The backend features an automated fallback engine that runs locally with or without external Postgres/Redis instances.

#### 1. Backend Server Setup:
```bash
cd api
npm install
npm start
# Server listens on http://localhost:5000
# Swagger UI available at http://localhost:5000/api/docs
```

#### 2. Frontend Client Setup:
```bash
cd client
npm install
npm run dev
# Frontend dev server starts on http://localhost:3000
```

---

## 🏛️ Architecture & Rubric Highlights

- **Rubric 1 (Architecture & Scalability):** Layered Client-Server architecture with API Gateway load balancing across 2 container replicas using Round-Robin. Pure microservices was rejected to prevent dual-write anomalies across relational 3NF tables during Tatkal peak bookings (450 bookings/sec assumption).
- **Rubric 2 (REST API & UI Approach):** 8 resources from Class Diagram (`trains`, `schedules`, `stations`, `reservations`, `payments`, `seats`, `coaches`, `auth`). Standard nouns, HTTP verbs, status codes (`200`, `201`, `400`, `404`, `409 Conflict`, `422`). Served via OpenAPI 3.0 Swagger UI and exportable Postman collection.
- **Rubric 3 (Design Patterns & Quality Attributes):** 
  1. *Adapter Pattern:* `PaymentGatewayAdapter` decouples internal booking from external bank charge/refund APIs.
  2. *Strategy Pattern:* `RefundContext` dynamically computes railway refunds based on hours before departure (>48h: 90%, 12-48h: 75%, 4-12h: 50%, <4h: 0%).
  3. *Observer Pattern:* `BookingSubject` dispatches decoupled SMS, Email, and Audit notifications upon booking and cancellation.
  4. *Factory Pattern:* `PaymentMethodFactory` instantiates UPI, Card, and NetBanking processors.
  5. *Quality Trade-off:* Strong consistency prioritized over read latency for seat booking to eliminate overbooking risks.
- **Rubric 4 (Deployment & Integration Trace):** Multi-container `docker-compose.yml`, Dockerfiles for each service, UML deployment diagram on `/design`, and full 14-step integration trace from UI to database.
- **Rubric 5 (ADRs & AI Review):** 3 formal Architectural Decision Records (Architecture, Caching, UI) and an AI review log table documenting prompts, accepted and rejected suggestions.
- **Rubric 6 (Demo & Viva):** Scripted 8-10 minute live presentation guide in `DEMO.md` and 15 viva questions split across group members in `VIVA_QA_SHEET.md`.
