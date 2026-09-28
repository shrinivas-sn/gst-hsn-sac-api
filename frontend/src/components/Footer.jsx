import React from 'react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '24px 20px', background: 'var(--bg-canvas)' }}>
      <div style={{
        maxWidth: 1120, margin: '0 auto', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)',
      }}>
        <div>
          Dataset: QuantumByteStudios HSN/SAC codes • Classification only
        </div>
        <div className="mono">
          Jev Tokens: paper-cobalt • snappy-utilitarian
        </div>
      </div>
    </footer>
  );
}
