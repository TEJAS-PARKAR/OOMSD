import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { reservationService } from '../services/api';
import { Search, Ticket, Train, Calendar, User, AlertTriangle, CheckCircle, RefreshCw, XCircle } from 'lucide-react';

export default function PnrStatus() {
  const [searchParams] = useSearchParams();
  const [pnr, setPnr] = useState(searchParams.get('searchPnr') || 'PNR847291');
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');
  const [cancelResult, setCancelResult] = useState(null);

  useEffect(() => {
    if (pnr) {
      handleSearch();
    }
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!pnr.trim()) return;

    setError('');
    setCancelResult(null);
    setLoading(true);
    try {
      const res = await reservationService.checkPNR(pnr.trim());
      setReservation(res.data.data);
    } catch (err) {
      setReservation(null);
      setError(err.response?.data?.error || `PNR "${pnr}" not found.`);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTicket = async () => {
    if (!window.confirm(`Are you sure you want to cancel PNR ${reservation.pnr}? Refund strategy will be computed dynamically.`)) {
      return;
    }

    setCancelling(true);
    setError('');
    try {
      const res = await reservationService.cancelTicket(reservation.pnr);
      setCancelResult(res.data.data);
      // Refresh reservation status
      const updated = await reservationService.checkPNR(reservation.pnr);
      setReservation(updated.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Cancellation failed.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Check PNR & Ticket Cancellation</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time query of reservation status, passenger allocation, and dynamic refund processing using the Strategy Pattern.
        </p>
      </div>

      {/* PNR Search Input */}
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto 2.5rem', padding: '1.75rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter 10-digit PNR (e.g. PNR847291)"
              value={pnr}
              onChange={(e) => setPnr(e.target.value.toUpperCase())}
              style={{ width: '100%', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontSize: '1.05rem' }}
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
            <Search size={16} /> {loading ? 'Checking...' : 'Check Status'}
          </button>
        </form>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.65rem', textAlign: 'center' }}>
          Tip: Try seed PNR <strong style={{ color: 'var(--primary)', cursor: 'pointer' }} onClick={() => setPnr('PNR847291')}>PNR847291</strong>
        </div>
      </div>

      {error && (
        <div style={{ maxWidth: '680px', margin: '0 auto 1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1rem', borderRadius: '8px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> {error}
        </div>
      )}

      {/* Cancelled Alert Box with Strategy Details */}
      {cancelResult && (
        <div className="glass-panel" style={{ maxWidth: '680px', margin: '0 auto 1.5rem', padding: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fbbf24', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.5rem' }}>
            <XCircle size={20} /> Ticket Successfully Cancelled
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            <strong>Strategy Applied:</strong> {cancelResult.ruleApplied}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '0.5rem' }}>
            <span>Original Fare: ₹{cancelResult.originalFare}</span>
            <span style={{ color: '#34d399', fontWeight: 800 }}>Refund Credited: ₹{cancelResult.refundAmount}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
            Refund Transaction ID: {cancelResult.refundReference}
          </div>
        </div>
      )}

      {/* Reservation Details Card */}
      {reservation && (
        <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passenger Name Record (PNR)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                {reservation.pnr}
              </div>
            </div>

            <div>
              <span className={`badge ${reservation.bookingStatus === 'CONFIRMED' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '0.85rem' }}>
                ● {reservation.bookingStatus}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Train</div>
              <div style={{ fontWeight: 700 }}>{reservation.trainNumber} - {reservation.trainName}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Route</div>
              <div style={{ fontWeight: 600 }}>{reservation.sourceStationCode} ➔ {reservation.destinationStationCode}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Journey Date</div>
              <div style={{ fontWeight: 600 }}>{reservation.journeyDate}</div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Passenger</div>
              <div style={{ fontWeight: 600 }}>{reservation.passengerName}</div>
            </div>
          </div>

          {/* Seat breakdown */}
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              Allocated Seats
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {reservation.seatDetails?.map((s, idx) => (
                <span key={idx} className="badge badge-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                  Coach {s.coachNumber} • Seat {s.seatNumber} ({s.berthType}) - {s.passengerName}
                </span>
              ))}
            </div>
          </div>

          {/* Payment & Action */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Amount Paid</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--success)' }}>
                ₹{reservation.totalFare}
              </div>
            </div>

            {reservation.bookingStatus === 'CONFIRMED' && (
              <button
                onClick={handleCancelTicket}
                disabled={cancelling}
                className="btn btn-danger"
              >
                {cancelling ? 'Computing Refund...' : 'Cancel Ticket'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Rubric D: Endpoints Used Panel */}
      <div className="glass-panel" style={{ maxWidth: '780px', margin: '3rem auto 0', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          FA2 Endpoint Trace for PNR & Cancellation:
        </h4>
        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.5rem' }}>Method</th>
              <th style={{ padding: '0.5rem' }}>Endpoint</th>
              <th style={{ padding: '0.5rem' }}>Purpose</th>
              <th style={{ padding: '0.5rem' }}>Status Codes</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem', color: '#38bdf8' }}>GET</td>
              <td style={{ padding: '0.5rem' }}>/api/v1/reservations/:pnr</td>
              <td style={{ padding: '0.5rem' }}>Fetch Reservation and Payment details</td>
              <td style={{ padding: '0.5rem' }}>200 OK, 404 Not Found</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', color: '#ef4444' }}>POST</td>
              <td style={{ padding: '0.5rem' }}>/api/v1/reservations/:pnr/cancel</td>
              <td style={{ padding: '0.5rem' }}>Cancel ticket, apply Strategy pattern refund, unlock seats, notify observers</td>
              <td style={{ padding: '0.5rem' }}>200 OK, 400 Bad Request, 404 Not Found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
