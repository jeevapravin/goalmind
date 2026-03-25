from app.tools.gemini_client import call_llm_json

ENTITY_PROMPT = '''
Extract named entities from this input.
Input: "{goal}"
Return ONLY valid JSON:
{{
  "startup_name": "Zestly or null",
  "market_description": "meal-kit delivery",
  "location": "Tier-1 Indian cities",
  "numbers": ["₹500", "2 years"],
  "entity_context_string": "The startup is called Zestly. Market: meal-kit delivery. Target: Tier-1 Indian cities. Key numbers: ₹500, 2 years."
}}
'''

def extract_entities(goal: str) -> dict:
    prompt = ENTITY_PROMPT.format(goal=goal)
    return call_llm_json(prompt, max_tokens=600)
