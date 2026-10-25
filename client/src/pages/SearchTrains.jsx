import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { stationService, scheduleService } from '../services/api';
import { Search, Train, Calendar, MapPin, ArrowRight, Clock, ShieldCheck, Zap } from 'lucide-react';

export default function SearchTrains() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [source, setSource] = useState('PUNE');
  const [destination, setDestination] = useState('CSMT');
  const [journeyDate, setJourneyDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadStations() {
      try {
        const res = await stationService.getAll();
        setStations(res.data.data);
      } catch (err) {
        console.error('Failed to load stations', err);
      }
    }
    loadStations();
    handleSearch();
  }, []);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (source === destination) {
      setError('Source and Destination cannot be the same station.');
      return;
    }
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      const res = await scheduleService.search(source, destination, journeyDate);
      setSchedules(res.data.data);
      setIsFromCache(res.data.fromCache);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search trains.');
    } finally {
      setLoading(false);
    }
  };

  const handleBook = (schedule) => {
    navigate('/seats', {
      state: {
        scheduleId: schedule.scheduleID,
        trainNumber: schedule.trainNumber,
        trainName: schedule.trainName,
        source: schedule.sourceStationCode,
        destination: schedule.destinationStationCode,
        journeyDate: schedule.journeyDate || journeyDate,
        departureTime: schedule.departureTime,
        arrivalTime: schedule.arrivalTime,
        baseFare: schedule.baseFare
      }
    });
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      {/* Hero Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>
          <Zap size={12} /> FA2 Distributed Railway Reservation System
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
          Search & Book Train Tickets
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '0.95rem' }}>
          Real-time seat reservation with atomic seat locking, multi-replica load balancing, and Redis cache-aside acceleration.
        </p>
      </div>

      {/* Search Filter Card */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="var(--primary)" /> Source Station
            </label>
            <select
              className="form-select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              {stations.map((st) => (
                <option key={st.stationCode} value={st.stationCode}>
                  {st.stationName} ({st.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <MapPin size={14} color="var(--accent)" /> Destination Station
            </label>
            <select
              className="form-select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {stations.map((st) => (
                <option key={st.stationCode} value={st.stationCode}>
                  {st.stationName} ({st.stationCode})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={14} color="var(--warning)" /> Journey Date
            </label>
            <input
              type="date"
              className="form-input"
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', height: '42px' }}
            >
              <Search size={16} /> {loading ? 'Searching...' : 'Find Trains'}
            </button>
          </div>
        </form>

        {error && (
          <div style={{ marginTop: '1rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Results Header with Cache Badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700 }}>
          Available Trains ({schedules.length})
        </h2>
        {isFromCache ? (
          <span className="badge badge-success" title="Served directly from Redis Cache-Aside">
            ⚡ Redis Cache Hit
          </span>
        ) : (
          <span className="badge badge-primary" title="Queried directly from PostgreSQL DB">
            🐘 DB Query Miss (Cached for 300s)
          </span>
        )}
      </div>

      {/* Train Schedule Cards */}
      {schedules.length === 0 && searched && !loading && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <Train size={36} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No direct trains found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Try searching between <strong>PUNE</strong> and <strong>CSMT</strong> or today's date for guaranteed seed schedules.
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {schedules.map((sch) => (
          <div key={sch.scheduleID} className="card" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ flex: '1 1 280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>
                  {sch.trainNumber}
                </span>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                  {sch.trainName || 'Express Special'}
                </span>
                <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>
                  {sch.trainType || 'Superfast'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>Distance: {sch.distanceKM} KM</span>
                <span>•</span>
                <span>Date: {sch.journeyDate}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: '1 1 300px' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{sch.departureTime}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sch.sourceStationCode}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Clock size={14} color="var(--text-dim)" />
                <ArrowRight size={18} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{sch.arrivalTime}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{sch.destinationStationCode}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: '0 0 auto' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Base Fare</div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--success)' }}>
                  ₹{sch.baseFare}
                </div>
              </div>
              <button onClick={() => handleBook(sch)} className="btn btn-primary">
                Select Seat
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Rubric D: Endpoints Used Panel */}
      <div className="glass-panel" style={{ marginTop: '3rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <ShieldCheck size={16} color="var(--primary)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>FA2 Endpoint Trace for this Screen:</h4>
        </div>
        <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '0.5rem' }}>Method</th>
              <th style={{ padding: '0.5rem' }}>Endpoint</th>
              <th style={{ padding: '0.5rem' }}>Purpose</th>
              <th style={{ padding: '0.5rem' }}>Caching Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
              <td style={{ padding: '0.5rem', color: '#38bdf8' }}>GET</td>
              <td style={{ padding: '0.5rem' }}>/api/v1/stations</td>
              <td style={{ padding: '0.5rem' }}>Fetch all stations for dropdowns</td>
              <td style={{ padding: '0.5rem' }}>Redis Cache-Aside (TTL: 600s)</td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', color: '#38bdf8' }}>GET</td>
              <td style={{ padding: '0.5rem' }}>/api/v1/schedules/search?source=...&destination=...</td>
              <td style={{ padding: '0.5rem' }}>Search matching trains</td>
              <td style={{ padding: '0.5rem' }}>Redis Cache-Aside (TTL: 300s)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
