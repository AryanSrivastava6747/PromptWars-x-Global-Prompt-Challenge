import React, { useState } from 'react';
import { Landmark, Search, FileCheck, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export default function SchemeFinder() {
  const [age, setAge] = useState(35);
  const [income, setIncome] = useState(150000);
  const [occupation, setOccupation] = useState('Farmer');
  const [state, setState] = useState('Uttar Pradesh');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const occupationsList = ['Farmer', 'Agriculture Worker', 'Laborer', 'Retired', 'Unemployed', 'Homeless', 'Service', 'Other'];
  const statesList = ['Uttar Pradesh', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Maharashtra', 'Delhi', 'All'];

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    setExpandedId(null);
    try {
      const res = await fetch('/api/schemes/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state,
          occupation,
          age: parseInt(age),
          annual_income: parseFloat(income)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        alert("Failed to match schemes.");
      }
    } catch (err) {
      alert("Error linking to scheme eligibility services.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Landmark style={{ stroke: 'var(--primary-saffron)' }} />
        Government Schemes Matcher
      </h2>

      {/* Inputs Form */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="form-group">
          <label>Citizen Age: {age} Years</label>
          <input 
            type="range" 
            min="15" 
            max="95" 
            className="form-control" 
            style={{ padding: '0', cursor: 'pointer' }}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Annual Family Income (₹)</label>
          <input 
            type="number" 
            className="form-control" 
            value={income}
            onChange={(e) => setIncome(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Primary Occupation</label>
          <select className="lang-select" style={{ width: '100%', padding: '0.65rem' }} value={occupation} onChange={(e) => setOccupation(e.target.value)}>
            {occupationsList.map(occ => <option key={occ} value={occ}>{occ}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Resident State</label>
          <select className="lang-select" style={{ width: '100%', padding: '0.65rem' }} value={state} onChange={(e) => setState(e.target.value)}>
            {statesList.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSearch} disabled={loading} style={{ width: '100%', padding: '0.75rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <Search style={{ width: '1.1rem' }} />
        {loading ? "Matching Eligibility Profiles..." : "Find Eligible Schemes"}
      </button>

      {/* Results grid */}
      {searched && (
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
            Eligible Schemes ({results.length})
          </h3>

          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              No matching government welfare schemes found for this profile. Try adjusting income or occupation filters.
            </div>
          ) : (
            <div className="scheme-grid">
              {results.map((scheme) => {
                const isExpanded = expandedId === scheme.scheme_id;
                return (
                  <div key={scheme.scheme_id} className="glass-card scheme-card" style={{ cursor: 'pointer' }} onClick={() => toggleExpand(scheme.scheme_id)}>
                    <div className="scheme-header">
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{scheme.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--success-green)', marginTop: '0.25rem', fontWeight: '500' }}>
                          {scheme.eligibility_reason}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="scheme-score">{(scheme.match_score * 100).toFixed(0)}% Match</span>
                        {isExpanded ? <ChevronUp style={{ width: '1rem' }} /> : <ChevronDown style={{ width: '1rem' }} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', animation: 'fadeIn 0.2s ease-in' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.85rem' }}>
                          <FileCheck style={{ width: '1rem', stroke: 'var(--primary-saffron)' }} />
                          Required Application Documents
                        </div>
                        <div className="document-list">
                          {scheme.required_documents.map((doc, index) => (
                            <div key={index} className="document-item">
                              <CheckCircle2 style={{ width: '0.85rem', color: 'var(--success-green)' }} />
                              <span>{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
