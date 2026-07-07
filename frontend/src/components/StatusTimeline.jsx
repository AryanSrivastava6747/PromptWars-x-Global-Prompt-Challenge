import React, { useState, useEffect } from 'react';
import { Eye, FileText, CheckCircle2, ChevronRight, Activity, MapPin, Clock } from 'lucide-react';

export default function StatusTimeline({ activeComplaintId }) {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Sync selected complaint when prop changes (from submission callback)
  useEffect(() => {
    if (activeComplaintId && complaints.length > 0) {
      const match = complaints.find(c => c.id === activeComplaintId);
      if (match) setSelectedComplaint(match);
    }
  }, [activeComplaintId, complaints]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/complaints');
      if (res.ok) {
        const data = await res.json();
        setComplaints(data);
        if (data.length > 0 && !selectedComplaint) {
          // Default to first one or matched one
          if (activeComplaintId) {
            const match = data.find(c => c.id === activeComplaintId);
            setSelectedComplaint(match || data[0]);
          } else {
            setSelectedComplaint(data[0]);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateStatusAdvance = async (newStatus) => {
    if (!selectedComplaint) return;
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}/status?status=${newStatus}`, {
        method: 'PATCH'
      });
      if (res.ok) {
        const updated = await res.json();
        // Update local list
        setComplaints(prev => prev.map(c => c.id === updated.id ? updated : c));
        setSelectedComplaint(updated);
      }
    } catch (err) {
      alert("Error advancing status.");
    }
  };

  const getTimelineSteps = (currentStatus) => {
    const steps = [
      { key: 'Submitted', label: 'Complaint Submitted', desc: 'AI successfully audited image proof and generated formal letter.' },
      { key: 'Under Review', label: 'Assigned to Ward Inspector', desc: 'Case file reviewed. Inspector dispatched for field validation.' },
      { key: 'Action Initiated', label: 'Field Operations Dispatched', desc: 'Contractor assigned. Work orders signed by civic commissioner.' },
      { key: 'Resolved', label: 'Redressal Confirmed', desc: 'Grievance resolved. Proof uploaded to municipal audit logs.' }
    ];

    const statusIndex = steps.findIndex(s => s.key === currentStatus);
    return steps.map((s, idx) => ({
      ...s,
      isCompleted: idx < statusIndex,
      isActive: idx === statusIndex
    }));
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity style={{ stroke: 'var(--primary-saffron)' }} />
        Civic Grievance Dashboard
      </h2>

      {complaints.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
          <Clock style={{ width: '2.5rem', height: '2.5rem', stroke: 'var(--text-muted)', marginBottom: '1rem' }} />
          <p style={{ fontWeight: '500' }}>No complaints filed yet.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Go to the "Report Issue" tab to upload visual proof and create your first tracker.
          </p>
        </div>
      ) : (
        <div className="content-grid" style={{ margin: '0' }}>
          {/* Left: Sidebar selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '500px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Filed Complaints ({complaints.length})
            </h4>
            {complaints.map((c) => {
              const isActive = selectedComplaint?.id === c.id;
              return (
                <div 
                  key={c.id} 
                  className="glass-card" 
                  onClick={() => setSelectedComplaint(c)}
                  style={{
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    borderColor: isActive ? 'var(--primary-saffron)' : 'var(--card-border)',
                    background: isActive ? 'var(--card-hover-bg)' : 'var(--card-bg)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{c.id}</span>
                    <span>{c.created_at.split('T')[0]}</span>
                  </div>
                  <h5 style={{ fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)' }}>{c.title}</h5>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>{c.category}</span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: c.status === 'Resolved' ? 'var(--success-green)' : 'var(--primary-saffron)',
                      fontWeight: 'bold'
                    }}>{c.status}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Details & Timeline */}
          {selectedComplaint && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', paddingLeft: '0.5rem' }}>
              {/* Top meta details */}
              <div className="glass-card" style={{ padding: '1rem', background: 'rgba(0,0,0,0.15)' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {selectedComplaint.image_url && (
                    <img 
                      src={selectedComplaint.image_url} 
                      alt="Attachment" 
                      style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--card-border)' }} 
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.1rem' }}>{selectedComplaint.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{selectedComplaint.description}</p>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem', fontSize: '0.75rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Category: <strong style={{ color: '#fff' }}>{selectedComplaint.category}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Priority: <strong style={{ color: '#fff' }}>{selectedComplaint.priority}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.15rem', color: 'var(--primary-saffron)' }}>
                        <MapPin style={{ width: '0.85rem' }} /> {selectedComplaint.latitude}, {selectedComplaint.longitude}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Officer Simulation Control Panel (Live Pitch Wow Factor) */}
                <div style={{ borderTop: '1px solid var(--card-border)', marginTop: '1rem', paddingTop: '0.85rem', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Activity style={{ width: '0.85rem', stroke: 'var(--primary-saffron)' }} />
                    Officer Simulation Console
                  </span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    {['Under Review', 'Action Initiated', 'Resolved'].map((st) => (
                      <button 
                        key={st}
                        className="btn btn-secondary" 
                        onClick={() => simulateStatusAdvance(st)} 
                        style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem', borderRadius: '4px' }}
                      >
                        Set: {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Timeline rendering */}
              <div className="timeline-container">
                {getTimelineSteps(selectedComplaint.status).map((step, idx) => (
                  <div 
                    key={step.key} 
                    className={`timeline-item ${step.isActive ? 'active' : ''} ${step.isCompleted ? 'completed' : ''}`}
                  >
                    <div className="timeline-badge">
                      {step.isCompleted && <CheckCircle2 style={{ width: '1rem', stroke: 'var(--success-green)', fill: 'rgba(16,185,129,0.1)' }} />}
                    </div>
                    <div className="timeline-body">
                      <div className="timeline-title">{step.label}</div>
                      <div className="timeline-desc">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
