import React, { useState, useEffect } from 'react';

export default function StatusPage() {
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    fetch('/health')
      .then((r) => r.json())
      .then(setHealthData)
      .catch((err) => setHealthData({ status: 'unreachable', error: err.message }));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          System Health & Discovery
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Live service diagnostics and CORS verification.
        </p>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
          Service Status
        </h2>
        <pre className="mono" style={{
          background: '#f8fafc', color: 'var(--text-main)', padding: 14, borderRadius: 6,
          fontSize: 12, border: '1px solid var(--border)',
        }}>
          {JSON.stringify(healthData, null, 2)}
        </pre>
      </div>
    </div>
  );
}
