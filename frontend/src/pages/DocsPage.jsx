import React from 'react';
import { API_BASE_URL } from '../config';

export function DocsPage() {
  const endpoints = [
    {
      method: 'GET',
      path: '/v1/hsn/search',
      params: 'q (required), limit, offset',
      description: 'Search across 16,825 HSN goods descriptions by token keywords.',
      example: `${API_BASE_URL}/v1/hsn/search?q=rice`,
    },
    {
      method: 'GET',
      path: '/v1/hsn/:code',
      params: 'code (path, required)',
      description: 'Exact lookup by 2, 4, 6, or 8-digit HSN or SAC code.',
      example: `${API_BASE_URL}/v1/hsn/0101`,
    },
    {
      method: 'GET',
      path: '/v1/hsn/chapters',
      params: 'none',
      description: 'List all 98 active tariff chapters with heading descriptions and item counts.',
      example: `${API_BASE_URL}/v1/hsn/chapters`,
    },
    {
      method: 'GET',
      path: '/v1/hsn/chapters/:chapter',
      params: 'chapter (path, 2 digits), limit, offset',
      description: 'List all commodities categorized under a specific tariff chapter.',
      example: `${API_BASE_URL}/v1/hsn/chapters/10`,
    },
    {
      method: 'GET',
      path: '/v1/sac/search',
      params: 'q (required), limit, offset',
      description: 'Search across 568 Services Accounting Codes (SAC, Chapter 99).',
      example: `${API_BASE_URL}/v1/sac/search?q=software`,
    },
    {
      method: 'GET',
      path: '/v1/sac/:code',
      params: 'code (path, required)',
      description: 'Exact lookup for a service accounting code.',
      example: `${API_BASE_URL}/v1/sac/995411`,
    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>API Documentation</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Complete endpoint specification, parameters, and error codes.
      </p>

      <section style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Endpoints</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {endpoints.map((ep) => (
            <div
              key={ep.path}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span
                  style={{
                    background: 'var(--primary-light)',
                    color: 'var(--primary)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '0.8rem',
                  }}
                >
                  {ep.method}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '1rem' }}>
                  {ep.path}
                </span>
              </div>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                {ep.description}
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-faint)' }}>
                <strong>Parameters:</strong> <code>{ep.params}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Standard Error Codes</h2>
        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-dim)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '10px 14px' }}>Code</th>
                <th style={{ padding: '10px 14px' }}>HTTP Status</th>
                <th style={{ padding: '10px 14px' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>MISSING_PARAM</td>
                <td style={{ padding: '10px 14px' }}>400 Bad Request</td>
                <td style={{ padding: '10px 14px' }}>A mandatory query parameter ('q') was omitted.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>NOT_FOUND</td>
                <td style={{ padding: '10px 14px' }}>404 Not Found</td>
                <td style={{ padding: '10px 14px' }}>The requested HSN/SAC code or chapter does not exist.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 14px', fontFamily: 'var(--font-mono)' }}>RATE_LIMITED</td>
                <td style={{ padding: '10px 14px' }}>429 Too Many Requests</td>
                <td style={{ padding: '10px 14px' }}>Exceeded the default limit of 100 requests per 15 minutes per IP.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
