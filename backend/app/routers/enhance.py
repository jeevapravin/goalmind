from fastapi import APIRouter
from pydantic import BaseModel
from app.agents.persona_detector import detect_persona
from app.agents.entity_extractor import extract_entities
from app.agents.assumption_engine import generate_assumptions
from app.agents.intent_decomposer import decompose_intent
from app.agents.domain_router import classify_domain
from app.agents.clarification import generate_clarifications

router = APIRouter(prefix="/api/enhance", tags=["enhance"])


class EnhanceRequest(BaseModel):
    goal: str


class AssumptionRequest(BaseModel):
    goal: str
    persona: str = 'founder'
    overrides: dict = {}


class ClarifyRequest(BaseModel):
    goal: str
    persona: str = 'founder'


# ── Safe wrappers: return fallback data on Gemini failure ──────────

@router.post("/persona")
async def get_persona(req: EnhanceRequest):
    try:
        return detect_persona(req.goal)
    except Exception as e:
        print(f"[!] Persona detection failed: {e}")
        return {
            "persona": "founder",
            "confidence": 0.5,
            "signals": [],
            "output_mode": "dense",
            "tone_adjustment": "direct"
        }


@router.post("/domain")
async def get_domain(req: EnhanceRequest):
    try:
        return classify_domain(req.goal)
    except Exception as e:
        print(f"[!] Domain classification failed: {e}")
        return {
            "domain": "startup_validation",
            "label": "Startup Validation",
            "confidence": 0.5,
            "framework_hint": ""
        }


@router.post("/intent")
async def get_intent(req: EnhanceRequest):
    try:
        return decompose_intent(req.goal)
    except Exception as e:
        print(f"[!] Intent decomposition failed: {e}")
        return {
            "surface_goal": req.goal,
            "underlying_need": "Validate this idea",
            "success_criteria": "Clear go/no-go decision",
            "unstated_fears": []
        }


@router.post("/entities")
async def get_entities(req: EnhanceRequest):
    try:
        return extract_entities(req.goal)
    except Exception as e:
        print(f"[!] Entity extraction failed: {e}")
        return {
            "startup_name": None,
            "market_description": "",
            "location": "",
            "numbers": [],
            "entity_context_string": req.goal
        }


@router.post("/assumptions")
async def get_assumptions(req: AssumptionRequest):
    try:
        result = generate_assumptions(req.goal, req.persona, req.overrides)
        return result if isinstance(result, list) else []
    except Exception as e:
        print(f"[!] Assumption generation failed: {e}")
        return []


@router.post("/clarify")
async def get_clarifications(req: ClarifyRequest):
    try:
        result = generate_clarifications(req.goal, req.persona)
        return result if isinstance(result, list) else []
    except Exception as e:
        print(f"[!] Clarification generation failed: {e}")
        return []
