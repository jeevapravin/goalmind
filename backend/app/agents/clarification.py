from app.tools.gemini_client import call_llm_json

CLARIFY_PROMPT = '''
Generate 5 clarifying questions for this goal.
Goal: "{goal}"  |  Persona: "{persona}"
For each question, give your current confidence (0-1) that you can auto-answer it,
and your best-guess assumed answer.
Return ONLY valid JSON array:
[
  {{
    "id": "target_geography",
    "question": "Which geography is this targeting?",
    "type": "options",
    "confidence": 0.55,
    "assumed_answer": "India",
    "options": ["India", "Southeast Asia", "US", "Global"],
    "card_set_key": null
  }},
  {{
    "id": "urgency_level",
    "question": "How urgently do you need to validate this?",
    "type": "spectrum",
    "confidence": 0.80,
    "assumed_answer": "This month",
    "options": ["Exploring casually", "Planning in months", "Deciding this week", "Launching now"],
    "spectrum_anchors": ["Just curious", "Launch-ready"]
  }}
]
'''

def generate_clarifications(goal: str, persona: str = 'founder') -> list:
    prompt = CLARIFY_PROMPT.format(goal=goal, persona=persona)
    all_q = call_llm_json(prompt, max_tokens=2000)
    # Only return questions where confidence < 0.75
    return [q for q in all_q if q.get('confidence', 1.0) < 0.75]
