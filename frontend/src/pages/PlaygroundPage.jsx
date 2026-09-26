import React, { useState } from 'react';
import { JsonViewer } from '../components/JsonViewer';
import { API_BASE_URL } from '../config';

export function PlaygroundPage() {
  const [tab, setTab] = useState('hsn-search');
  const [query, setQuery] = useState('rice');
  const [code, setCode] = useState('0101');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [activeUrl, setActiveUrl] = useState('');

  const executeRequest = async (endpoint) => {
    setLoading(true);
    const fullUrl = `${API_BASE_URL}${endpoint}`;
    setActiveUrl(fullUrl);
    try {
      const res = await fetch(fullUrl);
      const json = await res.json();
      setResponse(json);
    } catch (err) {
      setResponse({
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: err.message,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRun = (e) => {
    if (e) e.preventDefault();
    if (tab === 'hsn-search') {
      executeRequest(`/v1/hsn/search?q=${encodeURIComponent(query)}`);
    } else if (tab === 'sac-search') {
      executeRequest(`/v1/sac/search?q=${encodeURIComponent(query)}`);
    } else if (tab === 'code-lookup') {
      executeRequest(`/v1/hsn/${encodeURIComponent(code)}`);
    } else if (tab === 'chapters') {
      executeRequest('/v1/hsn/chapters');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>Interactive API Playground</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
        Test queries directly against the live backend API.
      </p>

      <div className="playground-box">
        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === 'hsn-search' ? 'active' : ''}`}
            onClick={() => {
              setTab('hsn-search');
              setQuery('rice');
            }}
          >
            Search Goods (HSN)
          </button>
          <button
            className={`tab-btn ${tab === 'sac-search' ? 'active' : ''}`}
            onClick={() => {
              setTab('sac-search');
              setQuery('software');
            }}
          >
            Search Services (SAC)
          </button>
          <button
            className={`tab-btn ${tab === 'code-lookup' ? 'active' : ''}`}
            onClick={() => {
              setTab('code-lookup');
              setCode('0101');
            }}
          >
            Lookup by Code
          </button>
          <button
            className={`tab-btn ${tab === 'chapters' ? 'active' : ''}`}
            onClick={() => {
              setTab('chapters');
            }}
          >
            Browse Chapters
          </button>
        </div>

        <form onSubmit={handleRun}>
          {(tab === 'hsn-search' || tab === 'sac-search') && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', fontWeight: 600 }}>
                Search Query
              </label>
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={tab === 'hsn-search' ? 'e.g. rice, wheat, cotton, vehicle' : 'e.g. software, consulting, legal'}
                />
                <button type="submit" className="btn-search" disabled={loading}>
                  {loading ? 'Fetching...' : 'Send Request'}
                </button>
              </div>
            </div>
          )}

          {tab === 'code-lookup' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '6px', fontWeight: 600 }}>
                Exact HSN or SAC Code (2, 4, 6, or 8 digits)
              </label>
              <div className="search-input-group">
                <input
                  type="text"
                  className="search-input"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. 0101, 1006, 995411"
                />
                <button type="submit" className="btn-search" disabled={loading}>
                  {loading ? 'Fetching...' : 'Lookup Code'}
                </button>
              </div>
            </div>
          )}

          {tab === 'chapters' && (
            <div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Retrieve all 98 active tariff chapters with commodity counts and headings.
              </p>
              <button type="submit" className="btn-search" disabled={loading}>
                {loading ? 'Fetching...' : 'List All Chapters'}
              </button>
            </div>
          )}
        </form>

        {activeUrl && (
          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Request URL:{' '}
            <code style={{ background: 'var(--bg-dim)', padding: '2px 6px', borderRadius: '4px' }}>
              {activeUrl}
            </code>
          </div>
        )}

        {response && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>Response Body</h3>
            <JsonViewer data={response} />
          </div>
        )}
      </div>
    </div>
  );
}
