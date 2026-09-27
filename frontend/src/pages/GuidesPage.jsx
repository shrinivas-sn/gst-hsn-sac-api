import React, { useState } from 'react';
import { GUIDES } from '../content/guidesData';

export default function GuidesPage() {
  const [selectedGuide, setSelectedGuide] = useState(GUIDES[0]);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredGuides = GUIDES.filter((g) =>
    g.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
    g.summary.toLowerCase().includes(filterQuery.toLowerCase()) ||
    g.keywords.some((k) => k.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <section className="card landing-reveal" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div className="badge" style={{ marginBottom: 8, fontSize: 10 }}>Technical Guides & SEO Reference</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
            Developer Guides & Tax Engineering
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            Practical implementation tutorials for GST HSN/SAC classification, e-invoicing length rules, and ERP integration.
          </p>
        </div>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Sidebar Guide List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            type="text"
            placeholder="Filter guides by keyword..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            style={{ width: '100%' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredGuides.map((guide) => {
              const isSelected = selectedGuide?.id === guide.id;
              return (
                <div
                  key={guide.id}
                  onClick={() => setSelectedGuide(guide)}
                  className="card"
                  style={{
                    cursor: 'pointer',
                    padding: '14px 16px',
                    borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                    background: isSelected ? 'var(--primary-light)' : 'var(--bg-card)',
                    boxShadow: isSelected ? 'var(--shadow)' : 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                    <span>{guide.category}</span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-main)', lineHeight: 1.4 }}>
                    {guide.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Guide Reader */}
        {selectedGuide && (
          <article className="card landing-reveal" style={{ padding: '28px 32px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <span className="badge">{selectedGuide.category}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• {selectedGuide.readTime}</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>• Published {selectedGuide.date}</span>
            </div>

            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--text-main)' }}>
              {selectedGuide.title}
            </h2>

            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 24, borderLeft: '3px solid var(--primary)', paddingLeft: 14 }}>
              {selectedGuide.summary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {selectedGuide.sections.map((sec, idx) => (
                <div key={idx}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                    {sec.heading}
                  </h3>
                  {sec.content && (
                    <div style={{ fontSize: 13, color: 'var(--text-main)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {sec.content}
                    </div>
                  )}
                  {sec.code && (
                    <pre className="mono" style={{
                      marginTop: 10, background: '#f8fafc', color: 'var(--text-main)', padding: 14,
                      borderRadius: 6, fontSize: 12, border: '1px solid var(--border)', overflowX: 'auto',
                    }}>
                      {sec.code}
                    </pre>
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8 }}>
                Indexed SEO Keywords:
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedGuide.keywords.map((kw) => (
                  <span key={kw} className="badge" style={{ fontSize: 10, background: '#f1f5f9', borderColor: '#e2e8f0', color: '#475569' }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
