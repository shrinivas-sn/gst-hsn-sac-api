import React, { useState, useEffect } from 'react';

export default function PlaygroundPage() {
  const [queryType, setQueryType] = useState('hsn');
  const [searchTerm, setSearchTerm] = useState('0101');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rawResponse, setRawResponse] = useState(null);

  const fetchResults = async (type, query) => {
    setLoading(true);
    try {
      const endpoint = type === 'hsn'
        ? `/v1/hsn/search?q=${encodeURIComponent(query || '')}`
        : `/v1/sac/search?q=${encodeURIComponent(query || '')}`;
      const res = await fetch(endpoint);
      const data = await res.json();
      setRawResponse(data);
      if (data && data.success && Array.isArray(data.data)) {
        setResults(data.data.slice(0, 50));
      } else {
        setResults([]);
      }
    } catch (err) {
      setResults([]);
      setRawResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(() => {
      fetchResults(queryType, searchTerm);
    }, 250);
    return () => clearTimeout(t);
  }, [queryType, searchTerm]);

  const copyCurl = () => {
    const origin = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:3000';
    const curl = `curl -s "${origin}/v1/${queryType}/search?q=${searchTerm}"`;
    navigator.clipboard.writeText(curl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section className="card landing-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge" style={{ marginBottom: 8, fontSize: 10 }}>Jev Certified • Light Registry</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            GST Classification Explorer
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Search the community HSN/SAC classification dataset. Tax rates are not supplied.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div className="card" style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc' }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>16,825</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>HSN Codes</div>
          </div>
          <div className="card" style={{ padding: '10px 16px', textAlign: 'center', background: '#f8fafc' }}>
            <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>568</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>SAC Codes</div>
          </div>
        </div>
      </section>

      <div className="landing-reveal landing-delay-1" style={{ display: 'flex', gap: 12 }}>
        <button
          className="btn"
          onClick={() => { setQueryType('hsn'); setSearchTerm('0101'); }}
          style={{
            borderColor: queryType === 'hsn' ? 'var(--primary)' : 'var(--border)',
            background: queryType === 'hsn' ? 'var(--primary-light)' : 'var(--bg-card)',
            color: queryType === 'hsn' ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: queryType === 'hsn' ? 600 : 500,
          }}
        >
          HSN Goods (Tariff Codes)
        </button>
        <button
          className="btn"
          onClick={() => { setQueryType('sac'); setSearchTerm('9954'); }}
          style={{
            borderColor: queryType === 'sac' ? 'var(--primary)' : 'var(--border)',
            background: queryType === 'sac' ? 'var(--primary-light)' : 'var(--bg-card)',
            color: queryType === 'sac' ? 'var(--primary)' : 'var(--text-main)',
            fontWeight: queryType === 'sac' ? 600 : 500,
          }}
        >
          SAC Services (Accounting Codes)
        </button>
      </div>

      <div className="landing-reveal landing-delay-2" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by code (e.g. 0101, 9954) or description (e.g. coffee, software)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1 }}
        />
        <button className="btn" onClick={copyCurl}>
          {copied ? '✓ Copied cURL' : 'Copy cURL'}
        </button>
      </div>

      <div className="card landing-reveal landing-delay-3" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex',
          justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc',
        }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>
            Results ({results.length}) {loading && '• Loading...'}
          </span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            Showing first 50 matches
          </span>
        </div>
        <table>
          <thead>
            <tr>
              <th style={{ width: 140 }}>Code</th>
              <th>Description</th>
              <th style={{ width: 140 }}>Hierarchy</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                  {r.code}
                </td>
                <td style={{ color: 'var(--text-main)' }}>
                  {r.description || r.details || '-'}
                </td>
                <td className="mono">{r.group || r.heading || r.code.slice(0, 2)}</td>
              </tr>
            ))}
            {results.length === 0 && !loading && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  No classification codes matched your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card landing-reveal landing-delay-3">
        <h3 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
          Raw API Response
        </h3>
        <pre className="mono" style={{
          background: '#f8fafc', color: 'var(--text-main)', padding: 14, borderRadius: 6, fontSize: 12,
          overflowX: 'auto', border: '1px solid var(--border)', maxHeight: 220,
        }}>
          {JSON.stringify(rawResponse, null, 2)}
        </pre>
      </div>
    </div>
  );
}
