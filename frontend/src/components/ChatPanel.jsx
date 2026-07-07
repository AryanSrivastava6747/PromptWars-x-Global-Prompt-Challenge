import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';

export default function ChatPanel({ language }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState([]);
  const chatEndRef = useRef(null);

  // Default system greetings in multiple languages
  const greetings = {
    en: {
      text: "Namaste! I am JanSetu AI, your civic companion. How can I help you navigate government schemes or file local grievances today?",
      actions: ["Check Old Age Pension", "Report a broken street light", "Find farm subsidies"]
    },
    hi: {
      text: "नमस्ते! मैं जनसेतु एआई हूं, आपका नागरिक साथी। मैं आज सरकारी योजनाओं को खोजने या स्थानीय शिकायतें दर्ज करने में आपकी क्या सहायता कर सकता हूं?",
      actions: ["वृद्धावस्था पेंशन जांचें", "टूटी हुई स्ट्रीट लाइट की रिपोर्ट करें", "कृषि सब्सिडी खोजें"]
    },
    ta: {
      text: "வணக்கம்! நான் ஜன்சேது ஏஐ, உங்கள் குடிமைத் தோழன். அரசுத் திட்டங்களைக் கண்டறிய அல்லது உள்ளூர் குறைகளைப் பதிவு செய்ய இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?",
      actions: ["முதியோர் ஓய்வூதியத்தை சரிபார்க்கவும்", "மின் விளக்கு பழுதடைந்துள்ளது", "விவசாய மானியங்களை கண்டறியவும்"]
    },
    bn: {
      text: "নমস্কার! আমি জনসেতু এআই, আপনার নাগরিক সহযোগী। আজ আমি আপনাকে সরকারি প্রকল্পগুলি খুঁজে পেতে বা স্থানীয় অভিযোগ জানাতে কীভাবে সাহায্য করতে পারি?",
      actions: ["বার্ধক্য ভাতা পরীক্ষা করুন", "ভাঙা রাস্তার আলো রিপোর্ট করুন", "কৃষি ভর্তুকি খুঁজুন"]
    }
  };

  // Load chat history or set initial greeting when language changes
  useEffect(() => {
    fetchHistory();
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`/api/chat/history/demo_citizen`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          // Format messages for state
          const formatted = data.map(m => ({
            sender: m.role === 'user' ? 'user' : 'assistant',
            text: m.content
          }));
          setMessages(formatted);
          setSuggestedActions([]);
        } else {
          // Initial greeting
          const greet = greetings[language] || greetings.en;
          setMessages([{ sender: 'assistant', text: greet.text }]);
          setSuggestedActions(greet.actions);
        }
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handleSend = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { sender: 'user', text: messageText }]);
    if (!textToSend) setInput('');
    setLoading(true);
    setSuggestedActions([]);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'demo_citizen',
          message: messageText,
          language_code: language
        })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { sender: 'assistant', text: data.reply }]);
        setSuggestedActions(data.suggested_actions || []);
      } else {
        setMessages(prev => [...prev, { sender: 'assistant', text: "Sorry, I could not process that request. Please try again." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', text: "Connection error. Make sure backend service is active." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear chat history?")) {
      try {
        await fetch(`/api/chat/history/demo_citizen`, { method: 'DELETE' });
        const greet = greetings[language] || greetings.en;
        setMessages([{ sender: 'assistant', text: greet.text }]);
        setSuggestedActions(greet.actions);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="glass-card chat-window">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles style={{ stroke: 'var(--primary-saffron)', width: '1.25rem' }} />
          <h3 style={{ fontSize: '1.1rem' }}>JanSetu AI Companion</h3>
        </div>
        <button className="btn btn-secondary" onClick={handleClearChat} style={{ padding: '0.35rem 0.65rem', display: 'flex', gap: '0.35rem', fontSize: '0.75rem' }}>
          <RefreshCw style={{ width: '0.85rem' }} />
          Reset Chat
        </button>
      </div>

      {/* Messages list */}
      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div key={idx} className={`message-bubble ${m.sender}`}>
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="message-bubble assistant" style={{ fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-saffron)', animation: 'pulse 1s infinite' }}></span>
            JanSetu is analyzing and writing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Actions */}
      {suggestedActions.length > 0 && (
        <div className="suggested-actions-container">
          {suggestedActions.map((action, idx) => (
            <button key={idx} className="suggested-action-btn" onClick={() => handleSend(action)}>
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="chat-input-area">
        <input
          type="text"
          className="form-control"
          placeholder="Ask in Hindi, English, Tamil, Bengali..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
        />
        <button className="btn btn-primary" onClick={() => handleSend()} disabled={loading} style={{ padding: '0 1.25rem' }}>
          <Send style={{ width: '1.1rem' }} />
        </button>
      </div>
    </div>
  );
}
