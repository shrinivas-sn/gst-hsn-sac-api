import React from 'react';

export default function DocsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          API Reference
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          REST endpoints for classification search and browsing. Tax rates are not supplied.
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Endpoints</h2>
        <div>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            {"GET /v1/hsn/search?q={query}"}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Case-insensitive search across 16,825 goods by code prefix or description keywords.
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            GET /v1/hsn/:code
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Exact lookup for 2, 4, 6, or 8-digit HSN classification code.
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            GET /v1/hsn/chapters
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Lists all 98 active tariff chapters with descriptions.
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            {"GET /v1/sac/search?q={query}"}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Search across 568 Services Accounting Codes.
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 14 }}>
          <div className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
            GET /v1/freshness
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            Snapshot provenance: source repository, upstream commit, snapshot date (6 Jun 2026), and age in days.
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 style={{ fontSize: 15, fontWeight: 700 }}>Data source and freshness</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Data comes from the MIT-licensed QuantumByteStudios/gst-hsn-sac-codes dataset, pinned to upstream commit
          c901c1b (6 Jun 2026). File checksums are recorded and tested, and a weekly workflow checks upstream for a newer
          data commit and opens an issue when one exists. Data is refreshed by hand after review.
        </p>
      </div>
    </div>
  );
}
