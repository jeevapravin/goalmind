from app.tools.gemini_client import call_llm_json
from app.schemas import SubtaskDefinition
from typing import List

DECOMPOSE_PROMPT = """You are GoalMind, an autonomous AI planning agent.

The user has given you this goal: "{goal}"

Your job: Break this goal into exactly 4 specific subtasks that must be completed to fully address it.

Rules:
- Each subtask must be SPECIFIC to the exact goal given (not generic)
- Each subtask must build on the previous one
- search_query must be a real web search query to find current data

Return ONLY a valid JSON array, no explanation:
[
  {{
    "id": 1,
    "title": "Market Research",
    "description": "Analyze current market size, demand, and demographics for this specific opportunity",
    "search_query": "rural healthcare delivery market size India 2024 2025"
  }},
  {{
    "id": 2,
    "title": "Competitor Analysis",
    "description": "Identify existing players, their strengths and gaps in this space",
    "search_query": "competitors rural healthcare medicine delivery startups India"
  }},
  {{
    "id": 3,
    "title": "Business Viability",
    "description": "Estimate revenue model, unit economics, and financial feasibility",
    "search_query": "healthcare delivery startup revenue model unit economics India"
  }},
  {{
    "id": 4,
    "title": "Risk Assessment",
    "description": "Identify top execution risks, regulatory hurdles, and failure modes",
    "search_query": "healthcare startup risks regulations India rural last mile"
  }}
]

Return the JSON for this goal: "{goal}"
"""

def decompose_goal(goal: str) -> List[SubtaskDefinition]:
    prompt = DECOMPOSE_PROMPT.format(goal=goal)
    raw = call_llm_json(prompt, max_tokens=4000)
    return [SubtaskDefinition(**item) for item in raw]