import React from 'react';

export function StatusBadge({ status = 'healthy' }) {
  const isHealthy = status === 'healthy' || status === 'up' || status === 'ok';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '0.85rem',
        fontWeight: '600',
        backgroundColor: isHealthy ? '#dcfce7' : '#fee2e2',
        color: isHealthy ? '#15803d' : '#b91c1c',
      }}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: isHealthy ? '#22c55e' : '#ef4444',
        }}
      />
      {isHealthy ? 'System Operational' : 'Degraded / Offline'}
    </span>
  );
}
