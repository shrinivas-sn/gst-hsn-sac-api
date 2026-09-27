import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar({ isOnline }) {
  const navLinks = [
    { name: 'Playground', to: '/' },
    { name: 'Chapters', to: '/chapters' },
    { name: 'Documentation', to: '/docs' },
    { name: 'Guides', to: '/guides' },
    { name: 'Health', to: '/status' },
  ];

  return (
    <header className="sticky-nav">
      <div style={{
        maxWidth: 1120, margin: '0 auto', padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <NavLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              ⚡ gst-hsn-sac
            </span>
          </NavLink>
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
          {navLinks.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              end={item.to === '/'}
              className="btn"
              style={({ isActive }) => ({
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                borderColor: isActive ? 'var(--primary)' : 'var(--border)',
                background: isActive ? 'var(--primary-light)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 500,
                boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
              })}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
