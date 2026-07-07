import os
import json
from fastapi import APIRouter, HTTPException
from typing import List
from backend.schemas.models import SchemeMatchRequest, SchemeMatchResponse

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])

SCHEMES_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "schemes.json")

def load_schemes() -> list:
    try:
        if os.path.exists(SCHEMES_FILE):
            with open(SCHEMES_FILE, "r", encoding="utf-8") as f:
                content = f.read().strip()
                if content:
                    return json.loads(content)
        return []
    except Exception as e:
        print(f"Error loading schemes: {e}")
        return []

@router.get("")
async def get_all_schemes():
    return load_schemes()

@router.post("/match", response_model=List[SchemeMatchResponse])
async def match_schemes(payload: SchemeMatchRequest):
    schemes = load_schemes()
    matched_results = []

    for scheme in schemes:
        rules = scheme.get("eligibility_rules", {})
        min_age = rules.get("min_age", 0)
        max_age = rules.get("max_age", 120)
        max_income = rules.get("max_income", 9999999)
        occupations = rules.get("occupations", ["All"])

        # Rule evaluation
        eligible = True
        reasons = []

        if payload.age < min_age or payload.age > max_age:
            eligible = False
            reasons.append(f"Age {payload.age} is not within required range of {min_age}-{max_age} years.")

        if payload.annual_income > max_income:
            eligible = False
            reasons.append(f"Annual income ₹{payload.annual_income} exceeds maximum limit of ₹{max_income}.")

        if "All" not in occupations and payload.occupation not in occupations:
            eligible = False
            reasons.append(f"Occupation '{payload.occupation}' is not listed in eligible categories: {', '.join(occupations)}.")

        if eligible:
            reason_text = (
                f"Matches all target criteria. Eligible based on age ({payload.age} yrs), "
                f"income under ₹{max_income}, and matching occupation category."
            )
            # Find default title for response
            titles = scheme.get("title", {})
            title_text = titles.get("en", "Scheme Details")

            matched_results.append(SchemeMatchResponse(
                scheme_id=scheme["id"],
                title=title_text,
                match_score=0.95 if payload.occupation in occupations else 0.85,
                eligibility_reason=reason_text,
                required_documents=scheme.get("required_documents", [])
            ))

    return sorted(matched_results, key=lambda x: x.match_score, reverse=True)
