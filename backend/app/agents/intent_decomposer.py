from app.tools.gemini_client import call_llm_json

INTENT_PROMPT = '''
Parse this goal into 3 levels.
Goal: "{goal}"
Return ONLY valid JSON:
{{
  "surface_goal": "Build a recipe app",
  "underlying_need": "Validate market fit before investing 6 months building",
  "success_criteria": "Know if 1,000 people would pay ₹199/month",
  "unstated_fears": ["Wasting savings on something nobody wants",
                     "Missing a simpler existing solution"]
}}
'''

def decompose_intent(goal: str) -> dict:
    prompt = INTENT_PROMPT.format(goal=goal)
    return call_llm_json(prompt, max_tokens=600)
