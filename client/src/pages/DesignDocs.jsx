import React, { useState } from 'react';
import {
  Layers, Database, Cpu, Network, BookOpen, ShieldCheck,
  CheckCircle, FileText, ArrowRight, Zap, Code, GitBranch,
  Terminal, Server, Lock, ExternalLink
} from 'lucide-react';

export default function DesignDocs() {
  const [activeSection, setActiveSection] = useState('arch');

  const navItems = [
    { id: 'arch', label: 'A. Architecture' },
    { id: 'api', label: 'B. REST API' },
    { id: 'perf', label: 'C. Scalability & Cache' },
    { id: 'ui', label: 'D. UI Approach' },
    { id: 'patterns', label: 'E. Design Patterns' },
    { id: 'qa', label: 'F. Quality Attributes' },
    { id: 'deploy', label: 'G. UML Deployment' },
    { id: 'trace', label: 'H. Integration Trace' },
    { id: 'adr', label: 'I. ADRs & AI Review' },
  ];

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.65rem' }}>
          <BookOpen size={12} /> FA2 System Architecture & Design Documentation
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Design to Deployment Specification</h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '780px', margin: '0.5rem auto 0', fontSize: '0.95rem' }}>
          Comprehensive architectural defense, quality attribute tactics, design patterns, ADRs, and deployment blueprints for the Online Railway Reservation System.
        </p>
      </div>

      {/* Navigation Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`btn ${activeSection === item.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', whiteSpace: 'nowrap' }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* =========================================================================
          SECTION A: ARCHITECTURE
      ========================================================================= */}
      {activeSection === 'arch' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              1. Chosen Architecture: Layered Client-Server Hybrid
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.25rem' }}>
              We chose the <strong>Layered Client-Server Architecture</strong> with an API Gateway & Reverse Proxy layer. 
              The frontend is a decoupled React Single-Page Application (SPA) communicating over stateless REST API contracts with a containerized Node.js/Express service cluster. The backend is partitioned into distinct logical layers:
              Presentation Layer (Controllers), Business Domain Layer (Services & Design Patterns), and Data Access Layer (Repositories with PostgreSQL 3NF Relational transactions).
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div className="card" style={{ borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '0.5rem' }}>Why Chosen</h4>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '1.25rem', lineHeight: '1.6' }}>
                  <li>Maintains 100% conceptual consistency with the FA1 Object-Oriented Class Diagram (`ReservationController`, `Train`, `Seat`, etc.).</li>
                  <li>Ensures ACID transactional guarantees required for atomic seat locking without distributed two-phase commit overhead.</li>
                  <li>Easily horizontally scalable by adding stateless API replicas behind the Nginx load balancer.</li>
                </ul>
              </div>

              <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
                <h4 style={{ fontWeight: 700, color: 'var(--danger)', marginBottom: '0.5rem' }}>Rejected Pattern: Pure Microservices</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Microservices was rejected because decomposing our 8 tightly coupled 3NF tables into separate database-per-service nodes (e.g. Seat Service, Payment Service, Booking Service) introduces the <strong>Dual-Write problem</strong> and distributed locking latency across network hops during Tatkal peak bookings. At our assumed scale, the operational complexity of distributed sagas outweighs the benefits.
                </p>
              </div>
            </div>

            {/* High Level Architecture Diagram */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              High-Level Architecture Diagram
            </h3>
            <div style={{ background: '#0d1117', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.75rem', textAlign: 'center' }}>
              <svg viewBox="0 0 900 380" style={{ width: '100%', maxHeight: '380px' }}>
                <rect x="20" y="140" width="130" height="90" rx="8" fill="#1f293d" stroke="#38bdf8" strokeWidth="2"/>
                <text x="85" y="180" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">React SPA Client</text>
                <text x="85" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">Vite / Port 3000</text>

                <path d="M 150 185 L 230 185" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#arrow)"/>
                <text x="190" y="175" fill="#38bdf8" fontSize="10" textAnchor="middle">HTTP / JSON</text>

                <rect x="230" y="120" width="150" height="130" rx="8" fill="#1f293d" stroke="#6366f1" strokeWidth="2"/>
                <text x="305" y="160" fill="#f8fafc" fontSize="13" fontWeight="bold" textAnchor="middle">Nginx Gateway / LB</text>
                <text x="305" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">Round-Robin (Port 80)</text>
                <text x="305" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">Rate Limit: 10 r/s</text>

                <path d="M 380 160 L 460 110" stroke="#6366f1" strokeWidth="2"/>
                <path d="M 380 210 L 460 260" stroke="#6366f1" strokeWidth="2"/>

                <rect x="460" y="70" width="160" height="80" rx="8" fill="#1f293d" stroke="#10b981" strokeWidth="2"/>
                <text x="540" y="105" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">API Replica 1</text>
                <text x="540" y="125" fill="#94a3b8" fontSize="10" textAnchor="middle">Node.js Express (:5000)</text>

                <rect x="460" y="220" width="160" height="80" rx="8" fill="#1f293d" stroke="#10b981" strokeWidth="2"/>
                <text x="540" y="255" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">API Replica 2</text>
                <text x="540" y="275" fill="#94a3b8" fontSize="10" textAnchor="middle">Node.js Express (:5000)</text>

                <path d="M 620 95 L 720 70" stroke="#f59e0b" strokeWidth="2"/>
                <path d="M 620 130 L 720 185" stroke="#38bdf8" strokeWidth="2"/>
                <path d="M 620 250 L 720 200" stroke="#38bdf8" strokeWidth="2"/>
                <path d="M 620 280 L 720 310" stroke="#ec4899" strokeWidth="2"/>

                <rect x="720" y="40" width="150" height="65" rx="8" fill="#1f293d" stroke="#f59e0b" strokeWidth="2"/>
                <text x="795" y="70" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Redis Cache</text>
                <text x="795" y="88" fill="#94a3b8" fontSize="10" textAnchor="middle">Cache-Aside (TTL 300s)</text>

                <rect x="720" y="150" width="150" height="80" rx="8" fill="#1f293d" stroke="#38bdf8" strokeWidth="2"/>
                <text x="795" y="180" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">PostgreSQL 16</text>
                <text x="795" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">3NF Schema / Port 5432</text>
                <text x="795" y="215" fill="#94a3b8" fontSize="9" textAnchor="middle">Atomic Row Locking</text>

                <rect x="720" y="280" width="150" height="65" rx="8" fill="#1f293d" stroke="#ec4899" strokeWidth="2"/>
                <text x="795" y="310" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">Mock Payment PG</text>
                <text x="795" y="328" fill="#94a3b8" fontSize="10" textAnchor="middle">Adapter Pattern</text>

                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>

          {/* Assumed Scenario Numbers Table */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-warning">Assumption Notice</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                Assumed Scenario Numbers (Basis for all Scaling Choices)
              </h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              The following operational metrics are assumed for an Indian Railway zonal division and drive every architectural decision:
            </p>

            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem' }}>Metric Parameter</th>
                  <th style={{ padding: '0.75rem' }}>Assumed Value</th>
                  <th style={{ padding: '0.75rem' }}>Impact on System Design</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Total Registered Passengers</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>500,000 users</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>B-Tree indexing on PASSENGER(Email) for O(log N) logins.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Peak Concurrent Active Users</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>25,000 users</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Nginx gateway load balancing across at least 2 Node.js API replicas.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Peak Bookings per Second (Tatkal)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>450 bookings/sec</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Short atomic database row locks (120s TTL) with 409 Conflict rejection.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>System Read : Write Ratio</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>9 : 1 (90% Reads, 10% Writes)</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Aggressive Cache-Aside caching on Station and Schedule queries via Redis.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>Active Daily Trains & Seats</td>
                  <td style={{ padding: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>250 trains / 180,000 seats</td>
                  <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Database table partitioning by JourneyDate and composite index on TRAIN_SCHEDULE.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION B: REST API SPECIFICATION
      ========================================================================= */}
      {activeSection === 'api' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                REST API Resource Specification (Rubric B)
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                All endpoints use pure nouns, explicit HTTP verbs, URI versioning (/api/v1/), and standard HTTP status codes.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href="/api/docs" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ fontSize: '0.8rem' }}>
                Open Swagger UI <ExternalLink size={13} />
              </a>
              <a href="/Railway_Reservation_System_FA2.postman_collection.json" download className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
                Download Postman Collection
              </a>
            </div>
          </div>

          <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Method</th>
                <th style={{ padding: '0.75rem' }}>Resource URL</th>
                <th style={{ padding: '0.75rem' }}>Purpose & Domain Class</th>
                <th style={{ padding: '0.75rem' }}>Status Codes</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>GET</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/stations</td>
                <td style={{ padding: '0.75rem' }}>Fetch all stations (Station class, Cached via Redis)</td>
                <td style={{ padding: '0.75rem' }}>200</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>GET</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/schedules/search</td>
                <td style={{ padding: '0.75rem' }}>Search trains by source, destination, date (TrainSchedule)</td>
                <td style={{ padding: '0.75rem' }}>200, 400</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>GET</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/seats/coaches/:coachId</td>
                <td style={{ padding: '0.75rem' }}>Check Live Seat Availability (Seat class, Uncached DB)</td>
                <td style={{ padding: '0.75rem' }}>200, 404</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>POST</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/seats/lock</td>
                <td style={{ padding: '0.75rem' }}>Acquire atomic 120s lock on seat (ReservationController)</td>
                <td style={{ padding: '0.75rem' }}>200, 400, 409 Conflict</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>POST</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/reservations</td>
                <td style={{ padding: '0.75rem' }}>14-Step Booking Flow: Payment + PNR Generation</td>
                <td style={{ padding: '0.75rem' }}>201 Created, 402, 409, 422</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#38bdf8', fontWeight: 700 }}>GET</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/reservations/:pnr</td>
                <td style={{ padding: '0.75rem' }}>Check PNR Status (Reservation & Payment classes)</td>
                <td style={{ padding: '0.75rem' }}>200, 404</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#ef4444', fontWeight: 700 }}>POST</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/reservations/:pnr/cancel</td>
                <td style={{ padding: '0.75rem' }}>Cancel Ticket & Process Refund via Strategy Pattern</td>
                <td style={{ padding: '0.75rem' }}>200, 400, 404</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>POST</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/admin/trains</td>
                <td style={{ padding: '0.75rem' }}>Add new Train (Admin class, JWT Role check)</td>
                <td style={{ padding: '0.75rem' }}>201, 401, 403</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', color: '#10b981', fontWeight: 700 }}>POST</td>
                <td style={{ padding: '0.75rem' }}>/api/v1/auth/login</td>
                <td style={{ padding: '0.75rem' }}>Passenger/Admin Authentication (returns JWT)</td>
                <td style={{ padding: '0.75rem' }}>200, 401</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* =========================================================================
          SECTION C: SCALABILITY AND PERFORMANCE
      ========================================================================= */}
      {activeSection === 'perf' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              Scalability & Caching Strategy (Rubric C)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.75rem' }}>
                  Vertical vs Horizontal Scaling
                </h3>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                  <li><strong>API Web Tier:</strong> Scaled <em>Horizontally</em> by adding stateless container replicas (`api-replica-1`, `api-replica-2`, ...). Handled by Nginx reverse proxy.</li>
                  <li><strong>Cache Layer (Redis):</strong> Scaled <em>Horizontally</em> using Redis Cluster / Sentinel master-replica topology for read replication.</li>
                  <li><strong>Database Tier (PostgreSQL):</strong> Primary node scaled <em>Vertically</em> (CPU & NVMe SSDs) for write throughput during Tatkal peak, supplemented by read replicas for passenger search queries.</li>
                </ul>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.75rem' }}>
                  Cache-Aside Strategy & Rules
                </h3>
                <ul style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7', paddingLeft: '1.25rem' }}>
                  <li><strong>What is Cached:</strong> Station master list (TTL: 600s), Train search results between stations (TTL: 300s), Train schedules.</li>
                  <li><strong>What is NEVER Cached:</strong> Live seat availability (`SEAT` status) and `PAYMENT` transactions. Must always read directly from PostgreSQL with atomic locks to guarantee zero overbooking.</li>
                  <li><strong>Invalidation:</strong> Triggered whenever Admin creates or modifies trains or schedules.</li>
                </ul>
              </div>
            </div>

            {/* Database optimization */}
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Database Indexes & Partitioning Strategy
            </h3>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.6rem' }}>Index Name</th>
                    <th style={{ padding: '0.6rem' }}>Target Table & Columns</th>
                    <th style={{ padding: '0.6rem' }}>Execution Optimization</th>
                  </tr>
                </thead>
                <tbody style={{ fontFamily: 'var(--font-mono)' }}>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem', color: 'var(--primary)' }}>idx_train_schedule_lookup</td>
                    <td style={{ padding: '0.6rem' }}>TRAIN_SCHEDULE(SourceStationCode, DestinationStationCode, JourneyDate)</td>
                    <td style={{ padding: '0.6rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Transforms full-table scan into an Index Scan for the high-volume search query.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem', color: 'var(--primary)' }}>idx_seat_status</td>
                    <td style={{ padding: '0.6rem' }}>SEAT(CoachID, Status)</td>
                    <td style={{ padding: '0.6rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Accelerates live seat availability check and expired lock clearance.</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.6rem', color: 'var(--primary)' }}>idx_reservation_passenger</td>
                    <td style={{ padding: '0.6rem' }}>RESERVATION(PassengerID)</td>
                    <td style={{ padding: '0.6rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Optimizes passenger booking history queries.</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '0.6rem', color: 'var(--primary)' }}>idx_payment_pnr</td>
                    <td style={{ padding: '0.6rem' }}>PAYMENT(PNR)</td>
                    <td style={{ padding: '0.6rem', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Sub-millisecond FK lookup during refund processing and PNR inquiry.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <h4 style={{ fontWeight: 700, marginBottom: '0.4rem' }}>Partitioning & Sharding Plan</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                For enterprise volume exceeding our assumed 180,000 daily bookings, the <code>RESERVATION</code> and <code>TRAIN_SCHEDULE</code> tables are range-partitioned monthly by <code>JourneyDate</code> (e.g. <code>RESERVATION_2026_10</code>). Past completed journeys are archived to cold storage, keeping active partition indexes entirely inside RAM. Sharding can be implemented on <code>TrainNumber % N</code> across regional database clusters.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION D: UI APPROACH COMPARISON
      ========================================================================= */}
      {activeSection === 'ui' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
            UI Approach Evaluation: HTML vs React vs HTMx (Rubric D)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            We evaluated three candidate UI rendering paradigms against the specific constraints of the Online Railway Reservation System:
          </p>

          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Approach</th>
                <th style={{ padding: '0.75rem' }}>Pros</th>
                <th style={{ padding: '0.75rem' }}>Cons</th>
                <th style={{ padding: '0.75rem' }}>Suitability for Railway System</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>Vanilla HTML + JS</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Zero build tooling, simple browser execution.</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Manual DOM reconciliation, state desynchronization in real-time seat grids.</td>
                <td style={{ padding: '0.75rem', color: '#f87171' }}>Suboptimal for dynamic multi-seat selection.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(56, 189, 248, 0.05)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>React (Chosen)</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Declarative reactive state, instant seat grid rerenders, reusable component architecture.</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Initial bundle download size, requires client runtime.</td>
                <td style={{ padding: '0.75rem', color: '#34d399', fontWeight: 700 }}>Best Fit: Instant UI feedback during seat locking.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 700 }}>HTMx</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Lightweight server-driven partial HTML swaps without JSON APIs.</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>Tightly couples backend templates to presentation; fails Rubric 2 requirement for pure REST API JSON.</td>
                <td style={{ padding: '0.75rem', color: '#f87171' }}>Rejected due to REST API decoupling needs.</td>
              </tr>
            </tbody>
          </table>

          <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
            <h4 style={{ fontWeight: 700, marginBottom: '0.4rem', color: 'var(--primary)' }}>Justification for React Choice</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Railway booking requires high-frequency micro-interactions (clicking a seat, locking it for 120s, countdown timer, immediate 409 conflict handling, dynamic fare calculation). React’s Virtual DOM and local component state allow seamless interactive coach browsing without full-page reloads, providing the responsive experience expected of modern IRCTC portals while cleanly consuming our decoupled versioned REST API.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION E: DESIGN PATTERNS
      ========================================================================= */}
      {activeSection === 'patterns' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              Design Patterns Implemented in Real Code (Rubric E)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              We implemented 4 classic Gang-of-Four (GoF) design patterns + MVC in the production backend to solve concrete engineering problems:
            </p>

            {/* Pattern 1: Adapter */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                  1. Adapter Pattern (Payment Gateway)
                </h3>
                <span className="badge badge-primary">GoF Structural</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>Problem:</strong> Decouple our domain <code>ReservationController</code> from vendor-specific external mock bank APIs (which expect proprietary parameter structures).
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>File Location:</strong> <code>api/src/patterns/adapter/PaymentGatewayAdapter.js</code>
              </div>
              <div className="code-block" style={{ marginBottom: '0.75rem' }}>
                {`// PaymentGatewayAdapter: Translates domain call into 3rd-party bank charge
export class PaymentGatewayAdapter extends IPaymentGateway {
  async processPayment({ pnr, amount, paymentMethod }) {
    const adapteeRequest = { orderId: pnr, amt: parseFloat(amount), channel: paymentMethod };
    const adapteeResponse = this.adaptee.executeCharge(adapteeRequest);
    return { success: adapteeResponse.status_code === 'TXN_SUCCESS', transactionReference: adapteeResponse.provider_ref_id };
  }
}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>
                <strong>New Class added to FA1:</strong> <code>IPaymentGateway</code> (Interface) and <code>PaymentGatewayAdapter</code> (Concrete Adapter).
              </div>
            </div>

            {/* Pattern 2: Strategy */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)' }}>
                  2. Strategy Pattern (Railway Refund Rules)
                </h3>
                <span className="badge badge-primary">GoF Behavioral</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>Problem:</strong> Cancellation refund percentage dynamically varies by hours remaining before departure (&gt;48h: 90% refund, 12-48h: 75% refund, 4-12h: 50% refund, &lt;4h: 0% refund). Hardcoding if-else trees violates Open-Closed Principle.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>File Location:</strong> <code>api/src/patterns/strategy/RefundStrategies.js</code> &amp; <code>RefundStrategyContext.js</code>
              </div>
              <div className="code-block" style={{ marginBottom: '0.75rem' }}>
                {`// Strategy selection based on hours until train departure
export class RefundContext {
  static selectStrategyByHours(hoursUntilDeparture) {
    if (hoursUntilDeparture >= 48) return new EarlyCancellationStrategy();   // 90%
    if (hoursUntilDeparture >= 12) return new ModerateCancellationStrategy();// 75%
    if (hoursUntilDeparture >= 4)  return new LateCancellationStrategy();    // 50%
    return new LastMinuteCancellationStrategy();                             // 0%
  }
}`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>
                <strong>New Class added to FA1:</strong> <code>IRefundStrategy</code>, <code>RefundContext</code>, and concrete strategy classes.
              </div>
            </div>

            {/* Pattern 3: Observer */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>
                  3. Observer Pattern (Booking & Cancellation Notifications)
                </h3>
                <span className="badge badge-primary">GoF Behavioral</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>Problem:</strong> When a ticket is confirmed or cancelled, secondary services (Email ticket delivery, SMS alert, Audit logging) must be notified without coupling to <code>ReservationController</code>.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>File Location:</strong> <code>api/src/patterns/observer/BookingSubject.js</code> &amp; <code>Observers.js</code>
              </div>
              <div className="code-block">
                {`// Observers dispatch Email, SMS, and Audit entries asynchronously
bookingSubject.attach(new EmailNotificationObserver());
bookingSubject.attach(new SMSNotificationObserver());
bookingSubject.attach(new AuditLogObserver());
await bookingSubject.notify('BOOKING_CONFIRMED', { pnr, totalFare, passengerEmail });`}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: '0.5rem' }}>
                <strong>New Class added to FA1:</strong> <code>BookingSubject</code>, <code>EmailNotificationObserver</code>, <code>SMSNotificationObserver</code>.
              </div>
            </div>

            {/* Pattern 4: Factory */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--warning)' }}>
                  4. Factory Pattern (Payment Channel Factory)
                </h3>
                <span className="badge badge-primary">GoF Creational</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                <strong>Problem:</strong> Dynamically instantiate and validate distinct payment channel processors (UPI, CreditCard, NetBanking) based on passenger selection.
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong>File Location:</strong> <code>api/src/patterns/factory/PaymentMethodFactory.js</code>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION F: QUALITY ATTRIBUTES
      ========================================================================= */}
      {activeSection === 'qa' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
            Quality Attributes & Architectural Trade-offs (Rubric F)
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Tactics implemented across the four primary ISO/IEC 25010 software quality attributes:
          </p>

          <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '2rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Quality Attribute</th>
                <th style={{ padding: '0.75rem' }}>Design Goal</th>
                <th style={{ padding: '0.75rem' }}>Concrete Tactic Implemented</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>Performance</td>
                <td style={{ padding: '0.75rem' }}>Sub-100ms response time on train search</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                  Redis Cache-Aside for station &amp; schedule lookups; B-Tree indexes on <code>TRAIN_SCHEDULE(Source, Dest, Date)</code>.
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>Scalability</td>
                <td style={{ padding: '0.75rem' }}>Handle 25,000 concurrent users at 450 rps</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                  Stateless API replicas behind Nginx Round-Robin load balancer; range partitioning strategy for high-volume booking tables.
                </td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>Maintainability</td>
                <td style={{ padding: '0.75rem' }}>Strict decoupling of domain rules</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                  Clean 3-layer architecture (Controllers, Patterns/Services, 3NF Models); Strategy pattern for isolated refund rule edits.
                </td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--danger)' }}>Security</td>
                <td style={{ padding: '0.75rem' }}>Defend against unauthorized access &amp; injection</td>
                <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>
                  Stateless JWT authentication, parameterized SQL queries, Bcrypt password hashing (10 salt rounds), Nginx rate limiting (10 r/s).
                </td>
              </tr>
            </tbody>
          </table>

          {/* Stated Architectural Trade-off */}
          <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>
              Explicit Architectural Trade-Off: Strong Consistency vs. Read Latency in Seat Selection
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              We made a deliberate engineering trade-off: <strong>We chose Strong Consistency over High Availability/Latency for Live Seat Availability and Booking.</strong>
              While train searches and station lists are cached aggressively in Redis to maximize throughput, <em>seat locking and seat availability bypass cache completely</em> and execute synchronous conditional updates with row locks directly on PostgreSQL. 
              <br /><br />
              <strong>Consequence:</strong> Seat checking has a slightly higher latency (~15ms vs ~1ms for cache) and database write contention during Tatkal rushes, but guarantees <strong>100% prevention of double-booking</strong>. In a railway ticketing domain, seat consistency is non-negotiable.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION G: UML DEPLOYMENT DIAGRAM & DOCKER
      ========================================================================= */}
      {activeSection === 'deploy' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              UML Deployment Diagram (Rubric G)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              The multi-container Docker Compose topology showing execution nodes, artifacts, communication protocols, and port bindings:
            </p>

            <div style={{ background: '#0d1117', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
              <svg viewBox="0 0 850 400" style={{ width: '100%', maxHeight: '400px' }}>
                {/* Host Machine Node */}
                <rect x="20" y="20" width="810" height="360" rx="10" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5"/>
                <text x="40" y="45" fill="#94a3b8" fontSize="13" fontWeight="bold">«device» Host Physical Machine (Docker Engine)</text>

                {/* Gateway Container */}
                <rect x="50" y="70" width="180" height="130" rx="8" fill="#1f293d" stroke="#6366f1" strokeWidth="2"/>
                <text x="140" y="95" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» gateway</text>
                <text x="140" y="115" fill="#38bdf8" fontSize="10" textAnchor="middle">Nginx 1.25 Alpine</text>
                <text x="140" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 80 (HTTP / Ingress)</text>
                <text x="140" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">LB: Round Robin</text>
                <text x="140" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">Rate Limit: 10r/s</text>

                {/* React Client Container */}
                <rect x="50" y="230" width="180" height="120" rx="8" fill="#1f293d" stroke="#38bdf8" strokeWidth="2"/>
                <text x="140" y="255" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» frontend</text>
                <text x="140" y="275" fill="#38bdf8" fontSize="10" textAnchor="middle">React 18 / Vite SPA</text>
                <text x="140" y="300" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 3000</text>
                <text x="140" y="325" fill="#94a3b8" fontSize="10" textAnchor="middle">«artifact» index.html, JS</text>

                {/* API Replica 1 */}
                <rect x="330" y="70" width="190" height="110" rx="8" fill="#1f293d" stroke="#10b981" strokeWidth="2"/>
                <text x="425" y="95" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» api-replica-1</text>
                <text x="425" y="115" fill="#10b981" fontSize="10" textAnchor="middle">Node 20 / Express</text>
                <text x="425" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 5000 (Internal)</text>
                <text x="425" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">«artifact» server.js</text>

                {/* API Replica 2 */}
                <rect x="330" y="210" width="190" height="110" rx="8" fill="#1f293d" stroke="#10b981" strokeWidth="2"/>
                <text x="425" y="235" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» api-replica-2</text>
                <text x="425" y="255" fill="#10b981" fontSize="10" textAnchor="middle">Node 20 / Express</text>
                <text x="425" y="280" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 5000 (Internal)</text>
                <text x="425" y="300" fill="#94a3b8" fontSize="10" textAnchor="middle">«artifact» server.js</text>

                {/* Redis Container */}
                <rect x="620" y="70" width="180" height="100" rx="8" fill="#1f293d" stroke="#f59e0b" strokeWidth="2"/>
                <text x="710" y="95" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» redis</text>
                <text x="710" y="115" fill="#f59e0b" fontSize="10" textAnchor="middle">Redis 7 Alpine</text>
                <text x="710" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 6379 (Internal)</text>

                {/* PostgreSQL Container */}
                <rect x="620" y="200" width="180" height="120" rx="8" fill="#1f293d" stroke="#38bdf8" strokeWidth="2"/>
                <text x="710" y="225" fill="#f8fafc" fontSize="12" fontWeight="bold" textAnchor="middle">«node» db</text>
                <text x="710" y="245" fill="#38bdf8" fontSize="10" textAnchor="middle">PostgreSQL 16</text>
                <text x="710" y="270" fill="#94a3b8" fontSize="10" textAnchor="middle">Port 5432</text>
                <text x="710" y="295" fill="#94a3b8" fontSize="9" textAnchor="middle">«artifact» schema.sql, 3NF</text>

                {/* Connectors */}
                <path d="M 230 135 L 330 120" stroke="#6366f1" strokeWidth="2"/>
                <path d="M 230 135 L 330 260" stroke="#6366f1" strokeWidth="2"/>
                <path d="M 520 120 L 620 110" stroke="#f59e0b" strokeWidth="2"/>
                <path d="M 520 135 L 620 240" stroke="#38bdf8" strokeWidth="2"/>
                <path d="M 520 250 L 620 250" stroke="#38bdf8" strokeWidth="2"/>
              </svg>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Container Breakdown Table
            </h3>
            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem' }}>Service Container</th>
                  <th style={{ padding: '0.65rem' }}>Base Image</th>
                  <th style={{ padding: '0.65rem' }}>Port Mappings</th>
                  <th style={{ padding: '0.65rem' }}>Purpose & Contents</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--primary)' }}>nginx / gateway</td>
                  <td style={{ padding: '0.65rem' }}>nginx:alpine</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>80:80</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Reverse proxy, round-robin load balancer between API replicas, rate limiting (10r/s).</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--accent)' }}>frontend</td>
                  <td style={{ padding: '0.65rem' }}>node:20-alpine</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>3000:3000</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>React 18 SPA serving ticket booking UI, PNR check, interactive seat grid, /design docs.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--success)' }}>api-replica-1 &amp; 2</td>
                  <td style={{ padding: '0.65rem' }}>node:20-alpine</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>5000 (internal)</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Node.js / Express REST API implementing FA1 classes, seat locking, Swagger UI, design patterns.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--warning)' }}>db</td>
                  <td style={{ padding: '0.65rem' }}>postgres:16-alpine</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>5432:5432</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>PostgreSQL 16 running FA1 3NF schema, indexes, and Indian railway seed dataset.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem', fontWeight: 700, color: '#ec4899' }}>redis</td>
                  <td style={{ padding: '0.65rem' }}>redis:7-alpine</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-mono)' }}>6379:6379</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>In-memory key-value cache store for Cache-Aside station and schedule acceleration.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION H: INTEGRATION TRACE & CONSISTENCY TABLE
      ========================================================================= */}
      {activeSection === 'trace' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--primary)' }}>
              End-to-End Integration Trace: "Book Ticket" Flow (Rubric H)
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Traces the FA1 14-Step Booking Flow end-to-end across UI Screen, REST Endpoint, Class Methods, Touched 3NF Tables, and Physical Docker Container:
            </p>

            <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.6rem' }}>Step</th>
                  <th style={{ padding: '0.6rem' }}>Screen / Actor</th>
                  <th style={{ padding: '0.6rem' }}>REST Endpoint</th>
                  <th style={{ padding: '0.6rem' }}>Invoked Class &amp; Method</th>
                  <th style={{ padding: '0.6rem' }}>Tables Touched</th>
                  <th style={{ padding: '0.6rem' }}>Container</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>1-3</td>
                  <td style={{ padding: '0.6rem' }}>Search Trains</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>GET /schedules/search</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>TrainSchedule.search()</td>
                  <td style={{ padding: '0.6rem' }}>TRAIN_SCHEDULE, TRAIN</td>
                  <td style={{ padding: '0.6rem' }}>api-replica-1/2</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>4-6</td>
                  <td style={{ padding: '0.6rem' }}>Seat Selection</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>POST /seats/lock</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Seat.lockSeat()</td>
                  <td style={{ padding: '0.6rem' }}>SEAT (Status = 'LOCKED')</td>
                  <td style={{ padding: '0.6rem' }}>api-replica-1/2</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>7-10</td>
                  <td style={{ padding: '0.6rem' }}>Payment Screen</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>POST /reservations</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>PaymentGatewayAdapter.processPayment()</td>
                  <td style={{ padding: '0.6rem' }}>None (External Mock PG)</td>
                  <td style={{ padding: '0.6rem' }}>api-replica-1/2</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>11</td>
                  <td style={{ padding: '0.6rem' }}>Backend Core</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Internal DB Commit</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Reservation.create(), Payment.create()</td>
                  <td style={{ padding: '0.6rem' }}>RESERVATION, PAYMENT</td>
                  <td style={{ padding: '0.6rem' }}>db (PostgreSQL)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>12</td>
                  <td style={{ padding: '0.6rem' }}>Backend Core</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Internal DB Commit</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Seat.markBooked()</td>
                  <td style={{ padding: '0.6rem' }}>SEAT (Status = 'BOOKED')</td>
                  <td style={{ padding: '0.6rem' }}>db (PostgreSQL)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>13</td>
                  <td style={{ padding: '0.6rem' }}>Observer Subject</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>Internal Event</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>BookingSubject.notify()</td>
                  <td style={{ padding: '0.6rem' }}>None (Console / SMS / Email)</td>
                  <td style={{ padding: '0.6rem' }}>api-replica-1/2</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.6rem', fontWeight: 700 }}>14</td>
                  <td style={{ padding: '0.6rem' }}>Ticket Card</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>HTTP 201 Response</td>
                  <td style={{ padding: '0.6rem', fontFamily: 'var(--font-mono)' }}>ReservationController.bookTicket()</td>
                  <td style={{ padding: '0.6rem' }}>Render confirmation UI</td>
                  <td style={{ padding: '0.6rem' }}>frontend</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Naming Consistency Table */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              Naming Consistency Matrix (FA1 Class Diagram ⇄ 3NF ER ⇄ REST API ⇄ UI Screen)
            </h3>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem' }}>FA1 Class</th>
                  <th style={{ padding: '0.65rem' }}>3NF Database Table</th>
                  <th style={{ padding: '0.65rem' }}>REST API Resource</th>
                  <th style={{ padding: '0.65rem' }}>UI Screen</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Passenger</td>
                  <td style={{ padding: '0.65rem' }}>PASSENGER</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/auth, /passengers</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Login &amp; Passenger Details</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Station</td>
                  <td style={{ padding: '0.65rem' }}>STATION</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/stations</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Search Trains dropdowns</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Train</td>
                  <td style={{ padding: '0.65rem' }}>TRAIN</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/trains</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Train Schedules list</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>TrainSchedule</td>
                  <td style={{ padding: '0.65rem' }}>TRAIN_SCHEDULE</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/schedules</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Train Schedule results</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Coach</td>
                  <td style={{ padding: '0.65rem' }}>COACH</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/trains/:num/coaches</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Coach Selector tabs</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Seat</td>
                  <td style={{ padding: '0.65rem' }}>SEAT</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/seats</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Interactive Seat Grid</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Reservation</td>
                  <td style={{ padding: '0.65rem' }}>RESERVATION (PK = PNR)</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/reservations</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Check PNR &amp; Confirmation</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>Payment</td>
                  <td style={{ padding: '0.65rem' }}>PAYMENT (FK = PNR)</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/payments</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Booking + Payment Screen</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem' }}>Admin</td>
                  <td style={{ padding: '0.65rem' }}>PASSENGER (Role = 'Admin')</td>
                  <td style={{ padding: '0.65rem' }}>/api/v1/admin/*</td>
                  <td style={{ padding: '0.65rem', fontFamily: 'var(--font-sans)' }}>Admin Management Console</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION I: ADRS & AI LOG
      ========================================================================= */}
      {activeSection === 'adr' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--primary)' }}>
              Architectural Decision Records (ADRs) (Rubric I)
            </h2>

            {/* ADR 1 */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ADR-001: Architecture Pattern Selection</h3>
                <span className="badge badge-success">Accepted</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <p><strong>Context:</strong> The system needs to support 25,000 peak concurrent users and 450 peak bookings per second during Tatkal rush while remaining runnable via a single `docker compose up` command for academic demonstration.</p>
                <p><strong>Options Considered:</strong> (1) Microservices with Database-per-service (Pro: independent deployability; Con: dual-write & distributed locking latency), (2) Layered Client-Server with API Gateway (Pro: ACID seat consistency, direct class diagram alignment; Con: scaled as a cluster unit).</p>
                <p><strong>Decision:</strong> Adopt Layered Client-Server with Nginx load balancer and containerized API replicas.</p>
                <p><strong>Consequences:</strong> Zero distributed transaction overhead; straightforward deployment and viva defense.</p>
              </div>
            </div>

            {/* ADR 2 */}
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ADR-002: Cache-Aside Strategy using Redis</h3>
                <span className="badge badge-success">Accepted</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <p><strong>Context:</strong> The system experiences a 9:1 read-to-write ratio with high volume search traffic between recurring city pairs.</p>
                <p><strong>Options Considered:</strong> (1) Write-Through caching (Pro: cache always updated; Con: slow booking commits), (2) Cache-Aside with TTL (Pro: cache only populated upon read demand, resilient to cache eviction; Con: initial cache miss latency).</p>
                <p><strong>Decision:</strong> Implement Cache-Aside with 300s TTL for searches and 600s TTL for stations. Live seat availability and payments strictly bypass cache.</p>
                <p><strong>Consequences:</strong> Prevents stale seat overbooking while shielding PostgreSQL from 90% of redundant search queries.</p>
              </div>
            </div>

            {/* ADR 3 */}
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>ADR-003: Frontend Architecture Selection</h3>
                <span className="badge badge-success">Accepted</span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                <p><strong>Context:</strong> The UI requires interactive coach seat matrix selection, 120s locking feedback, and instant 409 conflict handling.</p>
                <p><strong>Options Considered:</strong> (1) Vanilla HTML+JS (Pro: zero build step; Con: complex DOM synchronization), (2) React SPA (Pro: reactive seat states and component reuse; Con: Vite build step), (3) HTMx (Pro: minimal JS; Con: couples backend templates, violates pure JSON REST requirement).</p>
                <p><strong>Decision:</strong> Use React 18 with Vite.</p>
                <p><strong>Consequences:</strong> Decoupled UI consuming versioned /api/v1/ REST API endpoints cleanly.</p>
              </div>
            </div>
          </div>

          {/* AI Log Table */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>
              AI Collaboration Log (Student Audit Trail)
            </h3>
            <table style={{ width: '100%', fontSize: '0.82rem', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.65rem' }}>Prompt / Query</th>
                  <th style={{ padding: '0.65rem' }}>AI Suggestion</th>
                  <th style={{ padding: '0.65rem' }}>Decision</th>
                  <th style={{ padding: '0.65rem' }}>Justification</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>"Should we split Seat, Train, and Booking into separate microservices?"</td>
                  <td style={{ padding: '0.65rem' }}>AI suggested full microservices with Apache Kafka.</td>
                  <td style={{ padding: '0.65rem', color: '#f87171', fontWeight: 700 }}>Rejected</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Kafka and distributed saga transactions add unnecessary failure points for a 10-mark student evaluation.</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '0.65rem' }}>"Can we cache live seat availability in Redis with 10s TTL?"</td>
                  <td style={{ padding: '0.65rem' }}>AI recommended caching seat queries with short TTL.</td>
                  <td style={{ padding: '0.65rem', color: '#f87171', fontWeight: 700 }}>Rejected</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Rubric C explicitly forbids caching live seat availability to avoid double-booking concurrency bugs.</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.65rem' }}>"How should we implement the railway dynamic cancellation rules?"</td>
                  <td style={{ padding: '0.65rem' }}>AI proposed the Strategy Pattern with time-bracket strategies.</td>
                  <td style={{ padding: '0.65rem', color: '#34d399', fontWeight: 700 }}>Accepted</td>
                  <td style={{ padding: '0.65rem', color: 'var(--text-muted)' }}>Satisfies Rubric E GoF behavioral pattern requirement and mirrors IRCTC cancellation policies cleanly.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
