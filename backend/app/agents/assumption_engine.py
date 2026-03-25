from app.tools.gemini_client import call_llm_json

ASSUMPTION_PROMPT = '''
Given this goal and persona context, list exactly 5 assumptions you are making.
Goal: "{goal}"
Persona: "{persona}"
Overridden assumptions: {overrides}
Return ONLY valid JSON array:
[
  {{
    "id": "market_type",
    "assumption": "B2C consumer market",
    "category": "Market Type",
    "confidence": 0.82,
    "alternatives": ["B2B SaaS", "Marketplace", "D2C", "B2B2C"]
  }}
]
'''

def generate_assumptions(goal: str, persona: str, overrides: dict = {}) -> list:
    prompt = ASSUMPTION_PROMPT.format(
        goal=goal, persona=persona, overrides=str(overrides)
    )
    return call_llm_json(prompt, max_tokens=1500)
