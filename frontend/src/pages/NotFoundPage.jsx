import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '12px' }}>404 - Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        The requested page could not be found.
      </p>
      <Link
        to="/"
        style={{
          display: 'inline-block',
          background: 'var(--primary)',
          color: 'white',
          fontWeight: 600,
          padding: '10px 20px',
          borderRadius: '6px',
          textDecoration: 'none',
        }}
      >
        ← Return Home
      </Link>
    </div>
  );
}
