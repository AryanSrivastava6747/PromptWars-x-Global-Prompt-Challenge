import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Landmark, Search, AlertCircle, FileText, Activity, 
  ChevronRight, Users, CheckCircle, HelpCircle, ArrowRight 
} from 'lucide-react';

const AnimatedCount = ({ value, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(value.replace(/[^0-9]/g, ''), 10);
    if (isNaN(end)) {
      setCount(value);
      return;
    }
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // easeOutQuad
      const easeProgress = progress * (2 - progress);
      const currentVal = Math.floor(easeProgress * end);
      setCount(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  const suffix = value.replace(/[0-9]/g, '');
  return <span>{count.toLocaleString()}{suffix}</span>;
};

export default function HomeView({ onNavigate }) {
  // Quick Actions Config
  const quickActions = [
    {
      title: "Ask AI",
      desc: "Conversational citizen help desk answering queries in regional dialects.",
      icon: MessageSquare,
      color: "var(--primary-blue)",
      tab: "chat"
    },
    {
      title: "Government Services",
      desc: "Instant directory maps to digital municipal and civil departments.",
      icon: Landmark,
      color: "var(--primary-saffron)",
      tab: "schemes"
    },
    {
      title: "Scheme Finder",
      desc: "Input household parameters to check welfare benefit match rates.",
      icon: Search,
      color: "var(--success-green)",
      tab: "schemes"
    },
    {
      title: "Report Public Issue",
      desc: "Upload local damage files to generate official commissioner letters.",
      icon: AlertCircle,
      color: "var(--danger-red)",
      tab: "report"
    },
    {
      title: "Required Documents",
      desc: "Verify checklist procedures for pension, farm, or residential claims.",
      icon: FileText,
      color: "var(--warning-amber)",
      tab: "schemes"
    },
    {
      title: "Track Complaint",
      desc: "Real-time updates on ward repair queues and inspector resolution logs.",
      icon: Activity,
      color: "var(--primary-blue)",
      tab: "track"
    }
  ];

  // Stats Config
  const stats = [
    { value: "5000+", label: "Citizens Assisted", icon: Users, color: "var(--primary-blue)" },
    { value: "1200+", label: "Complaints Resolved", icon: CheckCircle, color: "var(--success-green)" },
    { value: "150+", label: "Government Schemes", icon: Landmark, color: "var(--primary-saffron)" },
    { value: "8+", label: "Languages Supported", icon: HelpCircle, color: "var(--warning-amber)" }
  ];

  // Timeline Step Config
  const timelineSteps = [
    {
      step: "01",
      title: "Ask AI",
      desc: "Submit your municipal queries or describe your situation in your local language."
    },
    {
      step: "02",
      title: "Receive Guidance",
      desc: "Get eligibility matches and required document checklists instantly."
    },
    {
      step: "03",
      title: "Submit Complaint",
      desc: "Upload photo proof and let AI generate your formal complaint letter."
    },
    {
      step: "04",
      title: "Track Progress",
      desc: "Watch the simulated ticket update in real-time as officials initiate field action."
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* 1. Hero Section */}
      <section className="glass-card hero-section" style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '2rem',
        padding: '3rem',
        alignItems: 'center',
        background: 'radial-gradient(circle at 10% 10%, rgba(255, 122, 48, 0.08), var(--card-bg))'
      }}>
        <div>
          <span style={{ 
            background: 'var(--primary-saffron-alpha)', 
            color: 'var(--primary-saffron)', 
            padding: '0.35rem 0.75rem', 
            borderRadius: '50px', 
            fontSize: '0.8rem', 
            fontWeight: '700', 
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            marginBottom: '1rem',
            border: '1px solid rgba(255, 122, 48, 0.2)'
          }}>
            <Landmark style={{ width: '0.85rem' }} /> National GenAI Civic Portal
          </span>
          <h1 style={{ 
            fontSize: '2.75rem', 
            lineHeight: '1.15', 
            marginBottom: '1.25rem', 
            fontFamily: 'var(--font-headings)',
            fontWeight: '800'
          }}>
            JanSetu AI – Your <span className="gradient-text">Intelligent Civic</span> Companion
          </h1>
          <p style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '1.05rem', 
            lineHeight: '1.6', 
            marginBottom: '2rem' 
          }}>
            Access government services, report public issues, discover welfare schemes, and receive multilingual AI assistance through Generative AI.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => onNavigate('chat')} style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              Talk to AI <ArrowRight style={{ width: '1.1rem' }} />
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('report')} style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
              Report an Issue
            </button>
          </div>
        </div>

        {/* AI Government Isometric SVG Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center' }} className="hide-mobile">
          <svg viewBox="0 0 500 450" width="100%" height="auto" style={{ maxWidth: '400px', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.5))' }}>
            {/* Background Grid */}
            <defs>
              <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="saf-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF7A30" />
                <stop offset="100%" stopColor="#C2410C" />
              </linearGradient>
              <linearGradient id="card-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0.05)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0.01)" />
              </linearGradient>
            </defs>

            {/* Base platform */}
            <path d="M 100,280 L 250,380 L 400,280 L 250,180 Z" fill="rgba(20, 24, 45, 0.6)" stroke="var(--card-border)" strokeWidth="2" />
            <path d="M 100,280 L 100,300 L 250,400 L 250,380 Z" fill="rgba(10, 12, 22, 0.8)" />
            <path d="M 250,380 L 250,400 L 400,300 L 400,280 Z" fill="rgba(10, 12, 22, 0.6)" />

            {/* Glowing inner network lines */}
            <path d="M 150,280 L 250,346 L 350,280 L 250,214 Z" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1.5" />
            <line x1="250" y1="214" x2="250" y2="346" stroke="rgba(255, 122, 48, 0.3)" strokeWidth="1.5" />

            {/* Center Pillar - AI Processing Core */}
            <rect x="235" y="160" width="30" height="120" rx="15" fill="url(#blue-grad)" opacity="0.8" />
            <circle cx="250" cy="180" r="22" fill="none" stroke="var(--primary-saffron)" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="250" cy="180" r="10" fill="var(--primary-saffron)" style={{ filter: 'drop-shadow(0 0 8px var(--primary-saffron))' }} />

            {/* Floating Portal Card 1 - Left */}
            <g transform="translate(0, -10)" style={{ animation: 'float 6s ease-in-out infinite' }}>
              <path d="M 90,180 L 170,230 L 220,200 L 140,150 Z" fill="url(#card-grad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Card Content Mockup */}
              <circle cx="130" cy="180" r="12" fill="var(--primary-blue)" opacity="0.8" />
              <rect x="150" y="174" width="40" height="4" rx="2" fill="#fff" opacity="0.6" />
              <rect x="150" y="182" width="25" height="4" rx="2" fill="#fff" opacity="0.4" />
            </g>

            {/* Floating Portal Card 2 - Right */}
            <g transform="translate(0, 10)" style={{ animation: 'float 6s ease-in-out infinite 3s' }}>
              <path d="M 280,200 L 360,250 L 410,220 L 330,170 Z" fill="url(#card-grad)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Card Content Mockup */}
              <rect x="320" y="200" width="10" height="10" rx="2" fill="var(--primary-saffron)" opacity="0.8" />
              <rect x="340" y="200" width="45" height="4" rx="2" fill="#fff" opacity="0.6" />
              <rect x="340" y="208" width="30" height="4" rx="2" fill="#fff" opacity="0.4" />
            </g>

            {/* Floating particles */}
            <circle cx="150" cy="100" r="4" fill="var(--primary-saffron)" opacity="0.7" style={{ animation: 'float 4s ease-in-out infinite' }} />
            <circle cx="350" cy="120" r="6" fill="var(--primary-blue)" opacity="0.5" style={{ animation: 'float 5s ease-in-out infinite 1s' }} />
            <circle cx="250" cy="80" r="5" fill="var(--success-green)" opacity="0.6" style={{ animation: 'float 3.5s ease-in-out infinite 2s' }} />
          </svg>
        </div>
      </section>

      {/* 2. Quick Action Cards */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>How can we help you today?</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Access localized governance systems and file requests directly</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <div 
                key={idx}
                className="glass-card quick-action-card"
                onClick={() => onNavigate(action.tab)}
                style={{
                  padding: '1.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: `4px solid ${action.color}`
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2.75rem',
                  height: '2.75rem',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--card-border)'
                }}>
                  <Icon style={{ stroke: action.color, width: '1.25rem' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {action.title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    {action.desc}
                  </p>
                </div>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: action.color, fontWeight: '700' }}>
                  Open Module <ChevronRight style={{ width: '0.85rem' }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Statistics Section */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
      }}>
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="glass-card" style={{
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '3rem',
                height: '3rem',
                borderRadius: '50%',
                background: `${stat.color}15`,
                border: `1px solid ${stat.color}30`
              }}>
                <Icon style={{ stroke: stat.color, width: '1.5rem' }} />
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-headings)', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                  <AnimatedCount value={stat.value} />
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                  {stat.label}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 4. How It Works Section */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Simple Four-Step Resolution</h2>
          <p style={{ color: 'var(--text-secondary)' }}>How JanSetu bridges citizen requirements and municipal actions</p>
        </div>

        <div className="how-it-works-timeline" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2.5rem',
          position: 'relative'
        }}>
          {timelineSteps.map((step, idx) => (
            <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {/* Step indicator node */}
              <div className="timeline-step-badge" style={{
                width: '3.5rem',
                height: '3.5rem',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '2px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontFamily: 'var(--font-headings)',
                fontWeight: '800',
                color: 'var(--primary-saffron)',
                marginBottom: '1.25rem',
                zIndex: '2',
                transition: 'var(--transition-normal)',
                boxShadow: 'var(--glass-shadow)'
              }}>
                {step.step}
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.5rem' }}>{step.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', maxWidth: '240px' }}>
                {step.desc}
              </p>

              {/* Connecting lines between steps */}
              {idx < 3 && (
                <div className="timeline-connector-line hide-mobile" style={{
                  position: 'absolute',
                  top: '1.75rem',
                  left: 'calc(50% + 2rem)',
                  width: 'calc(100% - 4rem)',
                  height: '2px',
                  borderTop: '2px dotted var(--card-border)',
                  zIndex: '1'
                }} />
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
