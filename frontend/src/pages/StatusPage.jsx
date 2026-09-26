import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { JsonViewer } from '../components/JsonViewer';
import { API_BASE_URL } from '../config';

export function StatusPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [latency, setLatency] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const start = performance.now();
      try {
        const res = await fetch(`${API_BASE_URL}/`);
        const duration = Math.round(performance.now() - start);
        setLatency(duration);
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>API Health & Status</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Live service status and dataset metrics.
      </p>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Current State</div>
            <StatusBadge status={error ? 'offline' : data?.data?.status || 'healthy'} />
          </div>
          {latency !== null && (
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Response Latency</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{latency} ms</span>
            </div>
          )}
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Origin</div>
            <code style={{ background: 'var(--bg-dim)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem' }}>{API_BASE_URL}</code>
          </div>
        </div>

        {loading && <p style={{ color: 'var(--text-muted)' }}>Probing health check endpoint...</p>}

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '6px' }}>
            <strong>Connection Failed:</strong> {error}
          </div>
        )}

        {data && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}>Live Payload</h3>
            <JsonViewer data={data} />
          </div>
        )}
      </div>
    </div>
  );
}
