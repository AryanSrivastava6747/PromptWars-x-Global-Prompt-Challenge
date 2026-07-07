# JanSetu AI: GenAI-Powered Civic Platform

> **PromptWars 2026 Global Prompt Challenge Submission** | Devengers  
> An AI-driven civic platform empowering citizens with seamless access to government services, grievance redressal, and welfare benefits through conversational AI.

## 🎯 Overview

**JanSetu AI** (The Citizen's Gateway) is a premium civic platform designed to empower every citizen—regardless of digital literacy, language barriers, or socio-economic background—with direct, transparent, and AI-enabled access to civic services, welfare benefits, and municipal issue resolution.

### Key Problems Solved
- **Complexity**: Simplifies bureaucratic language and government processes into conversational responses
- **Language Barriers**: Supports multilingual interactions (English, Hindi, Tamil, Bengali)
- **Friction in Reporting**: AI-powered issue intake with auto-generated complaint letters
- **Information Asymmetry**: Intelligent scheme matching for personalized benefit discovery

## ✨ Core Features

### 1. **Multilingual Conversational Companion**
   - Chat interface with real-time AI responses powered by Google Gemini
   - Natural language understanding of civic queries
   - Context-aware guidance without legal jargon

### 2. **Civic Issue Reporter**
   - Drag-and-drop image upload for issue documentation
   - AI auto-extracts issue category and urgency level
   - Auto-generates formal municipal complaint letters
   - Status tracking from submission through resolution

### 3. **Welfare Scheme Matcher**
   - Guided input wizard for citizen profiling
   - Intelligent eligibility matching against government schemes
   - Personalized recommendations based on demographics

### 4. **Live Grievance Tracker**
   - Real-time status pipeline visualization
   - Transparent complaint lifecycle tracking
   - Department assignment and action updates

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (Python)
- **AI/LLM**: Google Gemini API
- **Data Storage**: JSON-based local persistence
- **API Docs**: Swagger UI available at `/docs`

### Frontend
- **Build Tool**: Vite
- **Framework**: React 18 (JSX)
- **Styling**: Vanilla CSS with design system variables
- **Components**: Modular architecture for rapid iteration

### Architecture
- **Backend**: Modular router-based API structure
- **Data**: JSON files for complaints, schemes, and chat history
- **Frontend**: Component-based UI with local state management

## 📁 Project Structure

```
├── backend/                    # FastAPI Backend Server
│   ├── main.py                # Application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── data/                  # JSON data storage
│   │   ├── chat_history.json
│   │   ├── complaints.json
│   │   └── schemes.json
│   ├── routers/               # API endpoints
│   │   ├── chat.py           # Chat API
│   │   ├── complaints.py      # Complaint management
│   │   └── schemes.py         # Scheme discovery
│   ├── schemas/               # Pydantic models
│   │   └── models.py
│   └── services/              # Business logic
│       └── gemini.py          # Gemini AI service
├── frontend/                  # React + Vite Frontend
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx            # Main application layout
│       ├── main.jsx           # React entry point
│       └── components/
│           ├── ChatPanel.jsx
│           ├── HomeView.jsx
│           ├── IssueReporter.jsx
│           ├── SchemeFinder.jsx
│           └── StatusTimeline.jsx
│       └── styles/
│           ├── main.css
│           └── variables.css
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+ and npm
- Google Gemini API key

### Backend Setup

1. **Install dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set environment variables**
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

3. **Start the server**
   ```bash
   python main.py
   ```
   Server runs on `http://127.0.0.1:8000`
   
   Swagger API documentation: `http://127.0.0.1:8000/docs`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

## 📡 API Endpoints

### Chat API
- `POST /chat/send` - Send a query to the conversational AI

### Complaints API
- `GET /complaints/list` - Retrieve all complaints
- `POST /complaints/create` - File a new complaint
- `GET /complaints/{id}` - Get complaint details
- `PATCH /complaints/{id}/status` - Update complaint status

### Schemes API
- `GET /schemes/list` - List available schemes
- `POST /schemes/match` - Match citizen profile to eligible schemes
- `GET /schemes/{id}` - Get scheme details

## 🎨 Design Philosophy

- **Accessibility**: Clear, simple language; intuitive navigation
- **Performance**: Lightweight JSON storage; fast API responses
- **Modularity**: Independent feature components; clean separation of concerns
- **Scalability**: Router-based architecture; easy to add new endpoints

## 📝 Development Notes

- **Mock Database**: Uses JSON files for quick iteration without external DB setup
- **CORS**: Enabled for all origins during hackathon development
- **State Management**: Frontend components manage local state; backend serves as single source of truth
- **Styling**: Vanilla CSS with CSS variables for easy theme customization

## 🤝 Contributing

This is a hackathon submission focused on rapid prototyping and MVP delivery. For detailed technical specifications and future enhancements, refer to `civic_platform_hackathon_blueprint.md` and `implementation_plan.md`.

## 📄 License

Submission for PromptWars 2026 Global Prompt Challenge
