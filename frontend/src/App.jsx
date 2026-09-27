import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlaygroundPage from './pages/PlaygroundPage';
import ChaptersPage from './pages/ChaptersPage';
import DocsPage from './pages/DocsPage';
import GuidesPage from './pages/GuidesPage';
import StatusPage from './pages/StatusPage';

export function AppContent() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkHealth = () => {
      fetch('/health')
        .then((res) => setIsOnline(res.ok))
        .catch(() => setIsOnline(false));
    };
    checkHealth();
    const timer = setInterval(checkHealth, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="app-container">
      <Navbar isOnline={isOnline} />
      <main>
        <Routes>
          <Route path="/" element={<PlaygroundPage />} />
          <Route path="/playground" element={<Navigate to="/" replace />} />
          <Route path="/chapters" element={<ChaptersPage />} />
          <Route path="/docs" element={<DocsPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuidesPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/health" element={<Navigate to="/status" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
