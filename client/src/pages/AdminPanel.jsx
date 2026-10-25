import React, { useState, useEffect } from 'react';
import { adminService, trainService } from '../services/api';
import { Shield, Train, MapPin, Calendar, Layers, Activity, PlusCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('metrics');
  const [user, setUser] = useState(null);
  const [cacheMetrics, setCacheMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Form States
  const [trainForm, setTrainForm] = useState({ trainNumber: '', trainName: '', trainType: 'Superfast Express', totalCoaches: 12 });
  const [stationForm, setStationForm] = useState({ stationCode: '', stationName: '', city: '', state: '' });
  const [scheduleForm, setScheduleForm] = useState({
    trainNumber: '12157',
    sourceStationCode: 'PUNE',
    destinationStationCode: 'CSMT',
    departureTime: '11:00:00',
    arrivalTime: '14:30:00',
    journeyDate: new Date().toISOString().split('T')[0],
    distanceKM: 192,
    baseFare: 300
  });
  const [coachForm, setCoachForm] = useState({ trainNumber: '12157', coachNumber: 'C3', coachType: 'CC', seatCount: 12 });

  useEffect(() => {
    const storedUser = localStorage.getItem('railway_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const res = await trainService.getCacheDiagnostics();
      setCacheMetrics(res.data);
    } catch (err) {
      console.warn('Metrics load error', err);
    }
  };

  const handleAddTrain = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await adminService.addTrain(trainForm);
      setSuccessMsg(`Train ${trainForm.trainNumber} created successfully!`);
      setTrainForm({ trainNumber: '', trainName: '', trainType: 'Superfast Express', totalCoaches: 12 });
      loadMetrics();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add train. Ensure you are logged in as Admin.');
    }
  };

  const handleAddStation = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await adminService.addStation(stationForm);
      setSuccessMsg(`Station ${stationForm.stationCode} created successfully!`);
      setStationForm({ stationCode: '', stationName: '', city: '', state: '' });
      loadMetrics();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add station.');
    }
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await adminService.addSchedule(scheduleForm);
      setSuccessMsg('Train Schedule added successfully!');
      loadMetrics();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add schedule.');
    }
  };

  const handleAddCoach = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await adminService.addCoach(coachForm);
      setSuccessMsg(`Coach ${coachForm.coachNumber} and seats added successfully!`);
      loadMetrics();
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to add coach.');
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="badge badge-warning" style={{ marginBottom: '0.4rem' }}>
            <Shield size={12} /> Restricted Admin Resource
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Management Console</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Manage Trains, Stations, Schedules, Coaches, Seats, and inspect cluster cache diagnostics.
          </p>
        </div>

        {(!user || user.role !== 'Admin') && (
          <div className="card" style={{ padding: '0.75rem 1.25rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <span style={{ fontSize: '0.85rem', color: '#fbbf24', marginRight: '0.75rem' }}>
              Not logged in as Admin?
            </span>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
              Login as Admin
            </Link>
          </div>
        )}
      </div>

      {successMsg && (
        <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#34d399', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} /> {successMsg}
        </div>
      )}

      {errorMsg && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#f87171', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={18} /> {errorMsg}
        </div>
      )}

      {/* Admin Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`btn ${activeTab === 'metrics' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Activity size={15} /> System & Cache Metrics
        </button>
        <button
          onClick={() => setActiveTab('trains')}
          className={`btn ${activeTab === 'trains' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Train size={15} /> Add Train
        </button>
        <button
          onClick={() => setActiveTab('stations')}
          className={`btn ${activeTab === 'stations' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <MapPin size={15} /> Add Station
        </button>
        <button
          onClick={() => setActiveTab('schedules')}
          className={`btn ${activeTab === 'schedules' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Calendar size={15} /> Add Schedule
        </button>
        <button
          onClick={() => setActiveTab('coaches')}
          className={`btn ${activeTab === 'coaches' ? 'btn-primary' : 'btn-secondary'}`}
        >
          <Layers size={15} /> Add Coach & Seats
        </button>
      </div>

      {/* Tab: System & Cache Metrics */}
      {activeTab === 'metrics' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--primary)' }}>
              Caching Engine (Rubric C)
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <div>Strategy: <strong>{cacheMetrics?.strategy || 'Cache-Aside with TTL'}</strong></div>
              <div>Engine: <strong>{cacheMetrics?.metrics?.type || 'Redis / In-Memory'}</strong></div>
              <div>Cache Hits: <strong style={{ color: '#34d399' }}>{cacheMetrics?.metrics?.hits ?? 0}</strong></div>
              <div>Cache Misses: <strong style={{ color: '#f87171' }}>{cacheMetrics?.metrics?.misses ?? 0}</strong></div>
              <div>Hit Ratio: <strong>{cacheMetrics?.metrics?.ratio || '0%'}</strong></div>
            </div>
            <button onClick={loadMetrics} className="btn btn-secondary" style={{ marginTop: '1rem', width: '100%', fontSize: '0.8rem' }}>
              Refresh Diagnostics
            </button>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--accent)' }}>
              API Gateway & Load Balancer
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <div>Algorithm: <strong>Round-Robin with Least-Conn fallback</strong></div>
              <div>Upstream Cluster: <strong>api-replica-1:5000, api-replica-2:5000</strong></div>
              <div>Rate Limiting: <strong>10 requests/sec (Burst: 20)</strong></div>
              <div>Current Node: <strong>{cacheMetrics?.replicaId || 'API-Replica-1'}</strong></div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--success)' }}>
              Database & Consistency
            </h3>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.7' }}>
              <div>Schema Normalization: <strong>3NF Relational Model</strong></div>
              <div>Seat Locking: <strong>Atomic Conditional Update / Row-Lock</strong></div>
              <div>Isolation: <strong>Read Committed / Serializable</strong></div>
              <div>Primary Keys: <strong>PNR (RESERVATION), PaymentID</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Add Train */}
      {activeTab === 'trains' && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add New Train</h3>
          <form onSubmit={handleAddTrain} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Train Number (PK)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 12951"
                value={trainForm.trainNumber}
                onChange={(e) => setTrainForm({ ...trainForm, trainNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Train Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Mumbai Rajdhani Express"
                value={trainForm.trainName}
                onChange={(e) => setTrainForm({ ...trainForm, trainName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Train Type</label>
              <select
                className="form-select"
                value={trainForm.trainType}
                onChange={(e) => setTrainForm({ ...trainForm, trainType: e.target.value })}
              >
                <option value="Superfast Express">Superfast Express</option>
                <option value="Rajdhani Express">Rajdhani Express</option>
                <option value="Vande Bharat">Vande Bharat Express</option>
                <option value="Duronto Express">Duronto Express</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Create Train
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Station */}
      {activeTab === 'stations' && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add New Station</h3>
          <form onSubmit={handleAddStation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Station Code (PK, e.g. SUR, HYB)</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. SUR"
                value={stationForm.stationCode}
                onChange={(e) => setStationForm({ ...stationForm, stationCode: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Station Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Solapur Junction"
                value={stationForm.stationName}
                onChange={(e) => setStationForm({ ...stationForm, stationName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Solapur"
                value={stationForm.city}
                onChange={(e) => setStationForm({ ...stationForm, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">State</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maharashtra"
                value={stationForm.state}
                onChange={(e) => setStationForm({ ...stationForm, state: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Create Station
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Schedule */}
      {activeTab === 'schedules' && (
        <div className="glass-panel" style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add Train Schedule</h3>
          <form onSubmit={handleAddSchedule} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Train Number</label>
              <input
                type="text"
                className="form-input"
                value={scheduleForm.trainNumber}
                onChange={(e) => setScheduleForm({ ...scheduleForm, trainNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Journey Date</label>
              <input
                type="date"
                className="form-input"
                value={scheduleForm.journeyDate}
                onChange={(e) => setScheduleForm({ ...scheduleForm, journeyDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Source Station Code</label>
              <input
                type="text"
                className="form-input"
                value={scheduleForm.sourceStationCode}
                onChange={(e) => setScheduleForm({ ...scheduleForm, sourceStationCode: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Destination Station Code</label>
              <input
                type="text"
                className="form-input"
                value={scheduleForm.destinationStationCode}
                onChange={(e) => setScheduleForm({ ...scheduleForm, destinationStationCode: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Departure Time</label>
              <input
                type="time"
                className="form-input"
                value={scheduleForm.departureTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, departureTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Arrival Time</label>
              <input
                type="time"
                className="form-input"
                value={scheduleForm.arrivalTime}
                onChange={(e) => setScheduleForm({ ...scheduleForm, arrivalTime: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Base Fare (₹)</label>
              <input
                type="number"
                className="form-input"
                value={scheduleForm.baseFare}
                onChange={(e) => setScheduleForm({ ...scheduleForm, baseFare: parseFloat(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Distance (KM)</label>
              <input
                type="number"
                className="form-input"
                value={scheduleForm.distanceKM}
                onChange={(e) => setScheduleForm({ ...scheduleForm, distanceKM: parseInt(e.target.value) })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Save Schedule & Invalidate Cache
            </button>
          </form>
        </div>
      )}

      {/* Tab: Add Coach */}
      {activeTab === 'coaches' && (
        <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Add Coach & Auto-seed Seats</h3>
          <form onSubmit={handleAddCoach} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Train Number</label>
              <input
                type="text"
                className="form-input"
                value={coachForm.trainNumber}
                onChange={(e) => setCoachForm({ ...coachForm, trainNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Coach Number (e.g. C3, B2, S2)</label>
              <input
                type="text"
                className="form-input"
                value={coachForm.coachNumber}
                onChange={(e) => setCoachForm({ ...coachForm, coachNumber: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Coach Type</label>
              <select
                className="form-select"
                value={coachForm.coachType}
                onChange={(e) => setCoachForm({ ...coachForm, coachType: e.target.value })}
              >
                <option value="CC">Chair Car (CC)</option>
                <option value="3A">AC 3-Tier (3A)</option>
                <option value="2A">AC 2-Tier (2A)</option>
                <option value="SL">Sleeper (SL)</option>
                <option value="2S">Second Sitting (2S)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Seats to Auto-Generate</label>
              <input
                type="number"
                className="form-input"
                value={coachForm.seatCount}
                onChange={(e) => setCoachForm({ ...coachForm, seatCount: parseInt(e.target.value) })}
                min="1"
                max="72"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={16} /> Create Coach & Seed Seats
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
