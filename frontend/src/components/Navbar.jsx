import React from 'react';

export default function Navbar({ activeTab, onSelectTab, isOnline }) {
  return (
    <header className="sticky-nav">
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
            ⚡ gst-hsn-sac
          </span>
          <span className="badge" style={{ fontSize: 10 }}>
            fintech-minimal
          </span>
          <span className="badge" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11,
            background: isOnline ? '#ecfdf5' : '#fef2f2',
            borderColor: isOnline ? '#a7f3d0' : '#fecaca',
            color: isOnline ? '#047857' : '#b91c1c',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isOnline ? '#10b981' : '#ef4444',
            }} />
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <nav style={{ display: 'flex', gap: 8 }}>
          {['Playground', 'Chapters', 'Documentation', 'Guides', 'Health'].map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectTab(tab)}
              className="btn"
              style={{
                borderColor: activeTab === tab ? 'var(--primary)' : 'var(--border)',
                background: activeTab === tab ? 'var(--primary-light)' : 'transparent',
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: activeTab === tab ? 600 : 500,
                boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
