import React, { useState } from 'react';
import { Upload, AlertCircle, FileText, CheckCircle, MapPin } from 'lucide-react';

export default function IssueReporter({ onComplaintSubmitted }) {
  const [image, setImage] = useState(null); // base64 string
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  
  // Fields returned by AI
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Others');
  const [urgency, setUrgency] = useState('Medium');
  const [summary, setSummary] = useState('');
  const [letterDraft, setLetterDraft] = useState('');
  
  const [lat, setLat] = useState('12.9716'); // default Bangalore
  const [lng, setLng] = useState('77.5946');
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const runVisionAnalysis = async () => {
    if (!image) {
      alert("Please upload an image first!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/complaints/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64_image: image,
          user_description: description || "Reported public issue."
        })
      });

      if (res.ok) {
        const data = await res.json();
        setTitle(data.title || 'Public Grievance');
        setCategory(data.category || 'Others');
        setUrgency(data.urgency || 'Medium');
        setSummary(data.summary || '');
        setLetterDraft(data.official_draft || '');
        setAnalyzed(true);

        // Auto-generate minor offset to mock dynamic GPS pinning
        const offsetLat = (12.9716 + (Math.random() - 0.5) * 0.05).toFixed(4);
        const offsetLng = (77.5946 + (Math.random() - 0.5) * 0.05).toFixed(4);
        setLat(offsetLat);
        setLng(offsetLng);
      } else {
        alert("Failed to analyze image with Gemini. Check your configuration.");
      }
    } catch (err) {
      alert("Error connecting to backend services.");
    } finally {
      setLoading(false);
    }
  };

  const submitComplaint = async () => {
    if (!title.trim() || !letterDraft.trim()) {
      alert("Complaint title and official draft letter are required.");
      return;
    }

    try {
      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description: description || summary,
          image_url: image,
          priority: urgency,
          official_draft: letterDraft,
          latitude: parseFloat(lat),
          longitude: parseFloat(lng)
        })
      });

      if (res.ok) {
        const result = await res.json();
        alert(`Complaint filed successfully! Ticket ID: ${result.id}`);
        // Reset states
        setImage(null);
        setDescription('');
        setAnalyzed(false);
        // Call callback to navigate and load timeline
        if (onComplaintSubmitted) {
          onComplaintSubmitted(result.id);
        }
      } else {
        alert("Failed to save complaint.");
      }
    } catch (err) {
      alert("Error saving complaint to server database.");
    }
  };

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <AlertCircle style={{ stroke: 'var(--primary-saffron)' }} />
        Report Public Grievance
      </h2>

      {!analyzed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Drag-drop or File Picker */}
          <div 
            className={`upload-container ${dragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {image ? (
              <div style={{ position: 'relative', width: '100%', maxHeight: '200px', overflow: 'hidden', borderRadius: 'var(--border-radius-sm)' }}>
                <img src={image} alt="Upload preview" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                <button 
                  onClick={() => setImage(null)}
                  style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Change Image
                </button>
              </div>
            ) : (
              <>
                <Upload className="upload-icon" />
                <p style={{ fontWeight: '500' }}>Drag & Drop incident photo here, or click to upload</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Supports JPG, PNG (Max 5MB)</p>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  id="fileInput" 
                />
                <button className="btn btn-secondary" onClick={() => document.getElementById('fileInput').click()} style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                  Select File
                </button>
              </>
            )}
          </div>

          {/* Description input */}
          <div className="form-group">
            <label>Describe the incident context (Optional)</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Provide any additional details for the municipal commissioner..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button 
            className="btn btn-primary" 
            onClick={runVisionAnalysis} 
            disabled={loading || !image}
            style={{ width: '100%', padding: '0.75rem' }}
          >
            {loading ? "Analyzing Image with Gemini Vision..." : "Run Multimodal AI Audit"}
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Post-analysis result review and customization before submit */}
          <div style={{ display: 'flex', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: 'var(--border-radius-md)' }}>
            <img src={image} alt="Report attachment" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)' }} />
            <div>
              <h4 style={{ fontSize: '1rem' }}>Vision Analysis Summary</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{summary}</p>
            </div>
          </div>

          <div className="form-group">
            <label>AI Drafted Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Classification Category</label>
              <select className="lang-select" style={{ width: '100%' }} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Roads">Roads & Highway</option>
                <option value="Sanitation">Sanitation & Garbage</option>
                <option value="Water Supply">Water Supply & Leakage</option>
                <option value="Electricity">Electricity & Street Lights</option>
                <option value="Public Safety">Public Safety</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Tag</label>
              <select className="lang-select" style={{ width: '100%' }} value={urgency} onChange={(e) => setUrgency(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '0.5rem 1rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <MapPin style={{ width: '1rem', stroke: 'var(--primary-saffron)' }} />
              <span>Pinned GPS Geotag:</span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-primary)' }}>
              {lat}, {lng}
            </div>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <FileText style={{ width: '1rem' }} /> Official Commissioner Report Draft
            </label>
            <textarea
              className="form-control"
              rows="6"
              style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}
              value={letterDraft}
              onChange={(e) => setLetterDraft(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn btn-secondary" onClick={() => setAnalyzed(false)} style={{ flex: 1 }}>
              Back
            </button>
            <button className="btn btn-primary" onClick={submitComplaint} style={{ flex: 2, display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <CheckCircle style={{ width: '1.1rem' }} />
              File Official Complaint
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
