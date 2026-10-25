import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { reservationService } from '../services/api';
import { CreditCard, Smartphone, Building, ShieldCheck, ArrowLeft, Loader2, Check } from 'lucide-react';

export default function BookingPayment() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [passengerName, setPassengerName] = useState('Tejas Parkar');
  const [passengerEmail, setPassengerEmail] = useState('tejas@pccoe.edu.in');
  const [passengerPhone, setPassengerPhone] = useState('9123456780');

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('tejas@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8921 7842 1109');
  const [bankCode, setBankCode] = useState('HDFC');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!bookingData) {
    navigate('/');
    return null;
  }

  const { scheduleData, selectedSeats, totalFare } = bookingData;

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Prepare payload for 14-Step Booking Flow
      const payload = {
        scheduleId: scheduleData.scheduleId,
        trainNumber: scheduleData.trainNumber,
        journeyDate: scheduleData.journeyDate,
        selectedSeats: selectedSeats.map((s, idx) => ({
          seatId: s.seatID,
          seatNumber: s.seatNumber,
          coachNumber: s.coachNumber,
          berthType: s.berthType,
          passengerName: idx === 0 ? passengerName : `Passenger ${idx + 1}`
        })),
        paymentMethod,
        paymentDetails: paymentMethod === 'UPI' 
          ? { vpa: upiId } 
          : paymentMethod === 'NetBanking'
          ? { bankCode }
          : { cardNumber },
        passengerEmail,
        passengerPhone
      };

      const res = await reservationService.bookTicket(payload);

      if (res.data.success) {
        navigate('/confirmation', {
          state: {
            ticket: res.data.data
          }
        });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Booking transaction failed. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '1.5rem', gap: '0.4rem' }}>
        <ArrowLeft size={15} /> Back to Seat Selection
      </button>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Passenger & Payment Details</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Finalize your booking through the FA1 14-Step Booking Flow with Mock Payment Gateway Adapter.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
        {/* Form Column */}
        <form onSubmit={handlePayAndBook} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Passenger Information */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={18} color="var(--primary)" /> Primary Passenger Details
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (for e-Ticket)</label>
                <input
                  type="email"
                  className="form-input"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (for SMS PNR)</label>
                <input
                  type="tel"
                  className="form-input"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section (Factory Pattern in Action) */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Choose Payment Method (Factory Pattern)
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div
                onClick={() => setPaymentMethod('UPI')}
                className={`card ${paymentMethod === 'UPI' ? 'selected' : ''}`}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}
              >
                <Smartphone size={24} color={paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>UPI / QR</div>
              </div>

              <div
                onClick={() => setPaymentMethod('CreditCard')}
                className={`card ${paymentMethod === 'CreditCard' ? 'selected' : ''}`}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', border: paymentMethod === 'CreditCard' ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}
              >
                <CreditCard size={24} color={paymentMethod === 'CreditCard' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Credit / Debit Card</div>
              </div>

              <div
                onClick={() => setPaymentMethod('NetBanking')}
                className={`card ${paymentMethod === 'NetBanking' ? 'selected' : ''}`}
                style={{ textAlign: 'center', cursor: 'pointer', padding: '1rem', border: paymentMethod === 'NetBanking' ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}
              >
                <Building size={24} color={paymentMethod === 'NetBanking' ? 'var(--primary)' : 'var(--text-muted)'} style={{ margin: '0 auto 0.4rem' }} />
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>Net Banking</div>
              </div>
            </div>

            {paymentMethod === 'UPI' && (
              <div className="form-group">
                <label className="form-label">UPI ID / Virtual Payment Address</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  required
                />
              </div>
            )}

            {paymentMethod === 'CreditCard' && (
              <div className="form-group">
                <label className="form-label">Card Number (16-digits)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="4532 8921 7842 1109"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  required
                />
              </div>
            )}

            {paymentMethod === 'NetBanking' && (
              <div className="form-group">
                <label className="form-label">Select Your Bank</label>
                <select className="form-select" value={bankCode} onChange={(e) => setBankCode(e.target.value)}>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="SBI">State Bank of India</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                </select>
              </div>
            )}
          </div>

          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '6px' }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ height: '48px', fontSize: '1rem' }}
          >
            {loading ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <Loader2 size={18} className="animate-spin" /> Processing 14-Step Booking...
              </span>
            ) : (
              `Pay ₹${totalFare} & Confirm Ticket`
            )}
          </button>
        </form>

        {/* Order Summary Column */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            Trip Summary
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Train:</div>
              <div style={{ fontWeight: 700, color: 'var(--primary)' }}>
                {scheduleData.trainNumber} - {scheduleData.trainName}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Route:</div>
              <div style={{ fontWeight: 600 }}>
                {scheduleData.source} ➔ {scheduleData.destination}
              </div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Journey Date & Departure:</div>
              <div>{scheduleData.journeyDate} at {scheduleData.departureTime}</div>
            </div>

            <div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Seats Reserved:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                {selectedSeats.map((s) => (
                  <span key={s.seatID} className="badge badge-primary">
                    Coach {s.coachNumber} / Seat {s.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ticket Base Fare:</span>
                <span>₹{totalFare}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Convenience Fee:</span>
                <span>₹0.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800, marginTop: '0.5rem' }}>
                <span>Grand Total:</span>
                <span style={{ color: 'var(--success)' }}>₹{totalFare}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rubric D: Endpoints Used Panel */}
      <div className="glass-panel" style={{ marginTop: '3rem', padding: '1.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          FA2 Endpoint Trace for Booking & Payment:
        </h4>
        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.5rem' }}>Method</th>
              <th style={{ padding: '0.5rem' }}>Endpoint</th>
              <th style={{ padding: '0.5rem' }}>Triggered Backend Logic</th>
              <th style={{ padding: '0.5rem' }}>Return Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', color: '#10b981' }}>POST</td>
              <td style={{ padding: '0.5rem' }}>/api/v1/reservations</td>
              <td style={{ padding: '0.5rem' }}>
                Executes 14-Step Booking Flow: Validates schedule, PaymentGatewayAdapter, generates PNR, commits RESERVATION + PAYMENT, updates SEAT to BOOKED, and dispatches Observer notifications.
              </td>
              <td style={{ padding: '0.5rem' }}>201 Created</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
