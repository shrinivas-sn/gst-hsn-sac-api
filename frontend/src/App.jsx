import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PlaygroundPage from './pages/PlaygroundPage';
import ChaptersPage from './pages/ChaptersPage';
import DocsPage from './pages/DocsPage';
import GuidesPage from './pages/GuidesPage';
import StatusPage from './pages/StatusPage';

export default function App() {
  const [activeTab, setActiveTab] = useState('Playground');
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
      <Navbar activeTab={activeTab} onSelectTab={setActiveTab} isOnline={isOnline} />
      <main>
        {activeTab === 'Playground' && <PlaygroundPage />}
        {activeTab === 'Chapters' && <ChaptersPage />}
        {activeTab === 'Documentation' && <DocsPage />}
        {activeTab === 'Guides' && <GuidesPage />}
        {activeTab === 'Health' && <StatusPage />}
      </main>
      <Footer />
    </div>
  );
}
