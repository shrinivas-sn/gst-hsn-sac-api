import React, { useState, useEffect } from 'react';

export default function ChaptersPage() {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [chapterItems, setChapterItems] = useState([]);

  useEffect(() => {
    fetch('/v1/hsn/chapters')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          setChapters(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadChapter = async (num) => {
    setSelectedChapter(num);
    try {
      const res = await fetch(`/v1/hsn/chapters/${num}`);
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data)) {
        setChapterItems(data.data);
      }
    } catch {
      setChapterItems([]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>
          Tariff Chapters (1–98)
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          Official customs and excise tariff chapter structure.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
        {chapters.map((ch) => (
          <div
            key={ch.chapter || ch.code}
            onClick={() => loadChapter(ch.chapter || ch.code)}
            className="card"
            style={{
              padding: '12px 14px', cursor: 'pointer',
              borderColor: selectedChapter === (ch.chapter || ch.code) ? 'var(--primary)' : 'var(--border)',
              background: selectedChapter === (ch.chapter || ch.code) ? 'var(--primary-light)' : 'var(--bg-card)',
            }}
          >
            <div className="mono" style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 13 }}>
              Chapter {ch.chapter || ch.code}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {ch.description || 'Commodity classification'}
            </div>
          </div>
        ))}
      </div>

      {selectedChapter && (
        <div className="card" style={{ marginTop: 12 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Chapter {selectedChapter} Codes ({chapterItems.length})
          </h2>
          <table>
            <thead>
              <tr>
                <th style={{ width: 140 }}>HSN Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {chapterItems.map((item, i) => (
                <tr key={i}>
                  <td className="mono" style={{ fontWeight: 600, color: 'var(--primary)' }}>
                    {item.code}
                  </td>
                  <td>{item.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
