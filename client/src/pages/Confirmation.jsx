import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Train, Calendar, Clock, MapPin, User, Printer, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Confirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const ticket = location.state?.ticket;

  if (!ticket) {
    return (
      <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>
        <h2>No booking session active.</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Search
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '50%', marginBottom: '0.75rem' }}>
          <CheckCircle2 size={40} color="#10b981" />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Booking Confirmed!</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Your train reservation has been successfully booked and recorded in the 3NF RESERVATION table.
        </p>
      </div>

      {/* Ticket Card */}
      <div className="glass-panel" style={{ maxWidth: '780px', margin: '0 auto', padding: '2.25rem', border: '1px solid rgba(56, 189, 248, 0.3)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Passenger Name Record (PNR)
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em', fontFamily: 'var(--font-mono)' }}>
              {ticket.pnr}
            </div>
          </div>
          <span className="badge badge-success" style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem' }}>
            ● {ticket.bookingStatus}
          </span>
        </div>

        {/* Train & Journey details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Train Info</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              {ticket.trainNumber} - {ticket.trainName}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Journey Date</div>
            <div style={{ fontWeight: 600 }}>{ticket.journeyDate}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Route</div>
            <div style={{ fontWeight: 600 }}>
              {ticket.sourceStation} ({ticket.departureTime}) ➔ {ticket.destinationStation} ({ticket.arrivalTime})
            </div>
          </div>
        </div>

        {/* Passenger & Seat details */}
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            Confirmed Seats & Passenger Allocation
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {ticket.seats?.map((s, idx) => (
              <div key={idx} className="card" style={{ padding: '0.5rem 1rem', background: 'var(--bg-card)', flex: '1 1 200px' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.passengerName}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>
                  Coach {s.coachNumber} • Seat {s.seatNumber} ({s.berthType})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Metadata */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--border-color)', paddingTop: '1.25rem', fontSize: '0.85rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Txn Ref: </span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>{ticket.payment?.transactionReference}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)' }}>Total Paid: </span>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success)' }}>
              ₹{ticket.totalFare}
            </span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={handlePrint} className="btn btn-secondary">
          <Printer size={16} /> Print / Save PDF
        </button>
        <Link to={`/pnr?searchPnr=${ticket.pnr}`} className="btn btn-primary">
          View in Check PNR <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
