import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          404 — Page not found
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          This page does not exist. API routes live under <span className="mono">/v1</span>.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Open the playground</Link>
        <Link to="/docs" className="btn">Read the API docs</Link>
      </div>
    </div>
  );
}
