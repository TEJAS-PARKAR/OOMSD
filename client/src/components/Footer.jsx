import React from 'react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
        <div>
          <strong>Online Railway Reservation System</strong> • FA2 Design to Deployment
        </div>
        <div>
          Pimpri Chinchwad College of Engineering (PCCoE) | Subject: OOMSD (BCER27PC02) | Faculty: <strong>Prof. Shalu Mahajan</strong>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Group Members: <strong>Pankaj Gill</strong> • <strong>Ajim Pathan</strong> • <strong>Tejas Parkar</strong>
        </div>
      </div>
    </footer>
  );
}
