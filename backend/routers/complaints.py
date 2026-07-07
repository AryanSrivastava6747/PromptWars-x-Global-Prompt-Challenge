import os
import json
import uuid
import random
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from backend.schemas.models import Complaint, ComplaintCreate
from backend.services.gemini import GeminiService

router = APIRouter(prefix="/api/complaints", tags=["Complaints"])

COMPLAINTS_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "complaints.json")

class ImageAnalysisRequest(BaseModel):
    base64_image: str
    user_description: str

def load_complaints() -> list:
    try:
        if os.path.exists(COMPLAINTS_FILE):
            with open(COMPLAINTS_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
        return []
    except Exception as e:
        print(f"Error loading complaints: {e}")
        return []

def save_complaints(complaints: list):
    try:
        os.makedirs(os.path.dirname(COMPLAINTS_FILE), exist_ok=True)
        with open(COMPLAINTS_FILE, "w", encoding="utf-8") as f:
            json.dump(complaints, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error saving complaints: {e}")

@router.post("/analyze")
async def analyze_complaint(payload: ImageAnalysisRequest):
    analysis = GeminiService.analyze_complaint_image(payload.base64_image, payload.user_description)
    return analysis

@router.post("", response_model=Complaint)
async def create_complaint(payload: ComplaintCreate):
    complaints = load_complaints()
    
    # Generate human readable ticket ID e.g., JSETU-5893
    ticket_num = random.randint(1000, 9999)
    ticket_id = f"JSETU-{ticket_num}"
    
    new_complaint = Complaint(
        id=ticket_id,
        title=payload.title,
        category=payload.category,
        description=payload.description,
        image_url=payload.image_url,
        priority=payload.priority,
        status="Submitted",
        official_draft=payload.official_draft,
        latitude=payload.latitude,
        longitude=payload.longitude,
        created_at=datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    )
    
    complaints.append(new_complaint.dict())
    save_complaints(complaints)
    return new_complaint

@router.get("", response_model=List[Complaint])
async def list_complaints():
    return load_complaints()

@router.get("/{complaint_id}", response_model=Complaint)
async def get_complaint(complaint_id: str):
    complaints = load_complaints()
    for c in complaints:
        if c["id"] == complaint_id:
            return Complaint(**c)
    raise HTTPException(status_code=404, detail="Complaint not found")

@router.patch("/{complaint_id}/status", response_model=Complaint)
async def update_complaint_status(complaint_id: str, status: str = Query(..., description="New status value")):
    valid_statuses = ["Submitted", "Under Review", "Action Initiated", "Resolved"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of {valid_statuses}")
        
    complaints = load_complaints()
    for c in complaints:
        if c["id"] == complaint_id:
            c["status"] = status
            save_complaints(complaints)
            return Complaint(**c)
            
    raise HTTPException(status_code=404, detail="Complaint not found")
