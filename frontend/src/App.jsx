import React, { useState } from 'react';
import HomeView from './components/HomeView';
import ChatPanel from './components/ChatPanel';
import IssueReporter from './components/IssueReporter';
import SchemeFinder from './components/SchemeFinder';
import StatusTimeline from './components/StatusTimeline';
import { Landmark, MessageSquare, AlertCircle, TrendingUp, Sparkles, Home } from 'lucide-react';
import './styles/main.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [language, setLanguage] = useState('en');
  const [newlyCreatedTicketId, setNewlyCreatedTicketId] = useState(null);


  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleComplaintSubmitted = (ticketId) => {
    setNewlyCreatedTicketId(ticketId);
    setActiveTab('track');
  };

  return (
    <div className="app-container">
      {/* Premium Header */}
      <header className="glass-card app-header">
        <a href="/" className="brand">
          <Landmark className="brand-icon" />
          <span>JanSetu <span style={{ color: 'var(--primary-saffron)' }}>AI</span></span>
        </a>

        {/* Live Demo Metric Counters */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="hide-mobile">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <TrendingUp style={{ stroke: 'var(--success-green)', width: '1rem' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Resolved:</span>
            <strong style={{ color: 'var(--success-green)' }}>4,891</strong>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem' }}>
            <Sparkles style={{ stroke: 'var(--primary-saffron)', width: '1rem' }} />
            <span style={{ color: 'var(--text-secondary)' }}>Matching Schemes:</span>
            <strong style={{ color: 'var(--primary-saffron)' }}>140+</strong>
          </div>
        </div>

        {/* Language & Profile Action Bar */}
        <div className="header-actions">
          <select 
            className="lang-select" 
            value={language} 
            onChange={handleLanguageChange}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="bn">বাংলা (Bengali)</option>
          </select>
          <div style={{ fontSize: '0.8rem', background: 'var(--primary-blue-alpha)', color: 'var(--primary-blue)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.5rem 0.75rem', borderRadius: 'var(--border-radius-sm)', fontWeight: '600' }}>
            Guest Sandbox
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="nav-tabs">
        <button 
          className={`tab-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          <Home style={{ width: '1.1rem' }} />
          Home
        </button>
        <button 
          className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageSquare style={{ width: '1.1rem' }} />
          AI Companion
        </button>
        <button 
          className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
          onClick={() => setActiveTab('schemes')}
        >
          <Landmark style={{ width: '1.1rem' }} />
          Welfare Matcher
        </button>
        <button 
          className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
          onClick={() => setActiveTab('report')}
        >
          <AlertCircle style={{ width: '1.1rem' }} />
          Report Grievance
        </button>
        <button 
          className={`tab-btn ${activeTab === 'track' ? 'active' : ''}`}
          onClick={() => setActiveTab('track')}
        >
          <TrendingUp style={{ width: '1.1rem' }} />
          Live Tracker
        </button>
      </nav>

      {/* Primary Workspace View Area */}
      <main style={{ flex: 1, paddingBottom: '3rem' }}>
        {activeTab === 'home' && <HomeView onNavigate={setActiveTab} />}
        {activeTab === 'chat' && <ChatPanel language={language} />}
        {activeTab === 'schemes' && <SchemeFinder />}
        {activeTab === 'report' && <IssueReporter onComplaintSubmitted={handleComplaintSubmitted} />}
        {activeTab === 'track' && <StatusTimeline activeComplaintId={newlyCreatedTicketId} />}
      </main>
    </div>
  );
}
