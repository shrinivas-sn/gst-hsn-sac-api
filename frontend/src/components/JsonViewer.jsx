import React, { useState } from 'react';

export function JsonViewer({ data }) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'relative', marginTop: '12px' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          padding: '4px 8px',
          fontSize: '0.75rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        {copied ? 'Copied!' : 'Copy JSON'}
      </button>
      <pre style={{ maxHeight: '420px', overflowY: 'auto' }}>
        <code>{jsonString}</code>
      </pre>
    </div>
  );
}
