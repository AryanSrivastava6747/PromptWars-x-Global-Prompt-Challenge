import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import chat, complaints, schemes

app = FastAPI(
    title="JanSetu AI API",
    description="The backend service layer for JanSetu AI Civic Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for hackathon simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router)
app.include_router(complaints.router)
app.include_router(schemes.router)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "JanSetu AI",
        "description": "GenAI-Powered Civic Platform Core Services"
    }

if __name__ == "__main__":
    import uvicorn
    # Set default port to 8000
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
