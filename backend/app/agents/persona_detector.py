import json
from app.tools.gemini_client import call_llm_json

PERSONA_PROMPT = '''
Analyze this user input for linguistic signals only.
Input: "{input}"
Return ONLY valid JSON:
{{
  "persona": "student|maker|founder|executive",
  "confidence": 0.87,
  "signals": [
    {{"phrase": "worth it", "implication": "early uncertainty, not analyst framing"}},
    {{"phrase": "figure out", "implication": "exploratory mode, not execution mode"}}
  ],
  "output_mode": "explain|dense",
  "tone_adjustment": "reassurance|direct|analytical|executive-brief"
}}
'''

def detect_persona(raw_input: str) -> dict:
    prompt = PERSONA_PROMPT.format(input=raw_input)
    return call_llm_json(prompt, max_tokens=800)
