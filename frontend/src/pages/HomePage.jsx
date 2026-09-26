import React from 'react';
import { Link } from 'react-router-dom';
import { CodeSnippet } from '../components/CodeSnippet';
import { API_BASE_URL } from '../config';

export function HomePage() {
  const curlExample = `curl "${API_BASE_URL}/v1/hsn/search?q=rice"`;
  const jsExample = `const res = await fetch("${API_BASE_URL}/v1/hsn/search?q=rice");
const json = await res.json();
console.log(json.data);`;

  return (
    <div>
      <section className="hero">
        <h1>India GST HSN/SAC Code & Tax Rate Lookup API</h1>
        <p className="hero-subtitle">
          A free, keyless, open developer API for India's complete Goods & Services Tax classification directory. Instant full-text search and exact code lookups for billing, ERP, and e-commerce software.
        </p>
        <div style={{ marginTop: '20px' }}>
          <Link
            to="/playground"
            style={{
              display: 'inline-block',
              background: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: '6px',
              marginRight: '12px',
              textDecoration: 'none',
            }}
          >
            Open Interactive Playground →
          </Link>
          <Link
            to="/docs"
            style={{
              display: 'inline-block',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              fontWeight: 600,
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
            }}
          >
            API Reference
          </Link>
        </div>
      </section>

      <section className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">16,825</div>
          <div className="stat-label">HSN Goods Codes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">568</div>
          <div className="stat-label">SAC Services Codes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">98</div>
          <div className="stat-label">Tariff Chapters</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹0 / keyless</div>
          <div className="stat-label">Zero Auth Required</div>
        </div>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Quick Start</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Execute search requests directly from your terminal or application code:
        </p>
        <h3 style={{ fontSize: '1rem', marginTop: '16px' }}>Terminal (cURL)</h3>
        <CodeSnippet code={curlExample} />
        <h3 style={{ fontSize: '1rem', marginTop: '16px' }}>JavaScript / Node.js</h3>
        <CodeSnippet code={jsExample} language="javascript" />
      </section>
    </div>
  );
}
