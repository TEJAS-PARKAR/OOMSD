import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Train, Search, Ticket, Shield, BookOpen, ExternalLink, LogIn, LogOut, Cpu } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [replica, setReplica] = useState(localStorage.getItem('last_replica') || 'API-Replica-1');

  useEffect(() => {
    const storedUser = localStorage.getItem('railway_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('railway_token');
    localStorage.removeItem('railway_user');
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="container nav-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
            padding: '0.5rem',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Train size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em' }}>
              IRCTC <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Reserve</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
              PCCoE OOMSD FA2
            </div>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Search size={15} /> Search Trains
            </span>
          </Link>
          <Link to="/pnr" className={`nav-link ${isActive('/pnr') ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Ticket size={15} /> Check PNR
            </span>
          </Link>
          <Link to="/design" className={`nav-link ${isActive('/design') ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <BookOpen size={15} /> Design Docs (/design)
            </span>
          </Link>
          <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Shield size={15} /> Admin Panel
            </span>
          </Link>
          <a
            href="/api/docs"
            target="_blank"
            rel="noreferrer"
            className="nav-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
          >
            Swagger UI <ExternalLink size={13} />
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Active LB Replica Indicator */}
          <div
            title="Load Balancer Active Upstream Node"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              padding: '0.25rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              color: 'var(--primary)',
              fontFamily: 'var(--font-mono)'
            }}
          >
            <Cpu size={12} />
            {replica}
          </div>

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {user.name.split(' ')[0]} ({user.role})
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                <LogOut size={13} /> Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }}>
              <LogIn size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
