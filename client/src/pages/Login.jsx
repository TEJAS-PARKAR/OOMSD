import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { LogIn, UserPlus, KeyRound, Mail, ShieldAlert, CheckCircle } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('tejas@pccoe.edu.in');
  const [password, setPassword] = useState('Pass@123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fillAdmin = () => {
    setIsRegister(false);
    setEmail('admin@irctc.ac.in');
    setPassword('Admin@123');
  };

  const fillPassenger = () => {
    setIsRegister(false);
    setEmail('tejas@pccoe.edu.in');
    setPassword('Pass@123');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await authService.register({ name, email, phone, password });
        localStorage.setItem('railway_token', res.data.token);
        localStorage.setItem('railway_user', JSON.stringify(res.data.user));
        setSuccess('Registration successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        const res = await authService.login({ email, password });
        localStorage.setItem('railway_token', res.data.token);
        localStorage.setItem('railway_user', JSON.stringify(res.data.user));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          if (res.data.user.role === 'Admin') {
            navigate('/admin');
          } else {
            navigate('/');
          }
        }, 800);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '3rem' }}>
      <div className="glass-panel" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'rgba(56, 189, 248, 0.15)', borderRadius: '50%', marginBottom: '0.75rem' }}>
            <KeyRound size={28} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {isRegister ? 'Passenger Registration' : 'Account Login'}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Authenticate to manage bookings or access the restricted Admin Panel.
          </p>
        </div>

        {/* Demo Fast Login Shortcuts */}
        {!isRegister && (
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              ⚡ Faculty & Demo Quick Fill Credentials:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button type="button" onClick={fillAdmin} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                Fill Admin (Prof. Shalu)
              </button>
              <button type="button" onClick={fillPassenger} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                Fill Passenger (Tejas)
              </button>
            </div>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.75rem', borderRadius: '6px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {success && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.75rem', borderRadius: '6px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={16} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Pankaj Gill"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ height: '44px', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : isRegister ? 'Register Passenger' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {isRegister ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need a passenger account?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Register Here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
