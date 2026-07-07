from pydantic import BaseModel
from typing import List, Optional, Dict

class ChatMessage(BaseModel):
    user_id: str
    message: str
    language_code: str

class ChatResponse(BaseModel):
    reply: str
    suggested_actions: List[str]

class ComplaintCreate(BaseModel):
    title: str
    category: str
    description: str
    image_url: Optional[str] = None
    priority: str
    official_draft: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Complaint(BaseModel):
    id: str
    title: str
    category: str
    description: str
    image_url: Optional[str] = None
    priority: str
    status: str
    official_draft: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: str

class SchemeMatchRequest(BaseModel):
    state: str
    occupation: str
    age: int
    annual_income: float

class SchemeMatchResponse(BaseModel):
    scheme_id: str
    title: str
    match_score: float
    eligibility_reason: str
    required_documents: List[str]
