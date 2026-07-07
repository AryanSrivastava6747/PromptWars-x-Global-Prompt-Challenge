# Implementation Plan: Simplified JanSetu AI Hackathon MVP

Refactor the architecture of **JanSetu AI** to optimize for developer velocity and maximum demo quality in a 3-hour hackathon window. This simplifies the previous plan by removing authentication, database servers, and WebSockets, replacing them with a local FastAPI server and JSON file storage.

---

## User Review Required

> [!IMPORTANT]
> The database backend has changed from **Supabase PostgreSQL** to a lightweight **local JSON storage system** managed by FastAPI. Since authentication is removed, all operations will run under a default "Demo Citizen" session.

---

## Proposed Folder Structure & Architectural Breakdown

The project will be split into two main root directories: `frontend` and `backend`.

```
jansetu-ai/
├── backend/                   # FastAPI Backend
│   ├── data/                  # Local JSON Storage
│   ├── routers/               # APIRouter Modules (Modular endpoints)
│   ├── schemas/               # Pydantic Schemas for Request/Response validation
│   ├── services/              # Gemini LLM and Helper services
│   ├── main.py                # FastAPI Application Entrypoint
│   └── requirements.txt       # Backend dependencies
├── frontend/                  # Vite + React Frontend
│   ├── public/                # Static assets (fonts, icons, default images)
│   ├── src/
│   │   ├── components/        # Reusable UI Components
│   │   ├── styles/            # Vanilla CSS Design System
│   │   ├── App.jsx            # Layout, Navigation, Views router
│   │   └── main.jsx           # React app mount
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
└── README.md                  # Project instructions
```

### Folder Rationale

#### Backend (`/backend`)
*   **`data/`**: Serves as our mock database. It will contain JSON files (`complaints.json`, `schemes.json`, `chat_history.json`). Using JSON files enables persistent state across browser reloads without the overhead of spinning up an external database.
*   **`routers/`**: Segregates API routing (e.g., `chat.py`, `complaints.py`, `schemes.py`). This keeps the backend modular and clean, allowing individual features to be built and debugged independently.
*   **`schemas/`**: Contains Pydantic models. This ensures strict typing and automatically generates interactive API documentation via Swagger UI (`/docs`), making testing quick and visual.
*   **`services/`**: Holds the business logic wrapper for the Google Gemini API. Isolating this service ensures backend controllers don't clutter up with prompt templates.

#### Frontend (`/frontend`)
*   **`components/`**: House separate UI structures (e.g., `ChatPanel.jsx`, `IssueReporter.jsx`, `SchemeFinder.jsx`, `StatusTimeline.jsx`). Segmenting elements avoids single-file merge conflicts and enables rapid iterations.
*   **`styles/`**: Standardizes design tokens (colors, variables, glassmorphic filters). Maintaining custom variables in one place makes it trivial to customize the theme to a premium aesthetic.

---

## Verification Plan

### Automated Verification
*   Run FastAPI's built-in testing commands or query `http://127.0.0.1:8000/docs` directly to verify endpoint integrity.
*   Ensure all API responses match the specified schemas.

### Manual Verification
*   Run the local Vite dev server and submit a mock complaint. Check that the complaint is written successfully to `backend/data/complaints.json`.
*   Observe that the state updates on the tracking UI dashboard dynamically.
