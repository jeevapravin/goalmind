from app.tools.claude_client import call_claude, extract_json
from app.tools.tavily_tool import search_web
from app.schemas import SubtaskDefinition, SubtaskResult

EXECUTE_PROMPT = """You are GoalMind executing a specific research subtask.

ORIGINAL USER GOAL: "{goal}"

CURRENT SUBTASK: "{title}"
WHAT TO DO: "{description}"

LIVE WEB SEARCH RESULTS (use these for real current data):
{web_results}

PREVIOUS SUBTASK FINDINGS (use these to build on earlier research):
{previous_context}

Execute this subtask thoroughly using all available data above.

Return ONLY a valid JSON object:
{{
  "subtask_title": "{title}",
  "key_findings": [
    "Specific finding 1 with real data/numbers from web results",
    "Specific finding 2 with real data/numbers",
    "Specific finding 3 with real data/numbers"
  ],
  "analysis": "2-3 sentences of analysis connecting the findings to the goal. Be specific.",
  "metrics": [
    {{"label": "Market Size", "value": "$X.X B", "trend": "growing"}},
    {{"label": "Key Metric 2", "value": "XX%", "trend": "stable"}}
  ],
  "recommendation": "One specific, actionable recommendation directly related to this subtask",
  "confidence_level": "High"
}}

RULES:
- Reference real numbers from web results whenever possible
- If web results are empty, use your training knowledge but note it
- confidence_level must be exactly: High, Medium, or Low
- metrics should have 2-3 items relevant to this specific subtask
"""

def execute_subtask(
    subtask: SubtaskDefinition,
    goal: str,
    previous_results: list[SubtaskResult]
) -> SubtaskResult:
    
    # Step 1: Get live web data
    web_results = search_web(subtask.search_query)
    
    # Step 2: Build context from previous subtasks
    if previous_results:
        context_parts = []
        for r in previous_results:
            context_parts.append(
                f"[{r.subtask_title}]\n"
                + "\n".join(f"- {f}" for f in r.key_findings)
                + f"\nRecommendation: {r.recommendation}"
            )
        previous_context = "\n\n".join(context_parts)
    else:
        previous_context = "This is the first subtask. No previous findings."
    
    # Step 3: Execute with Claude
    prompt = EXECUTE_PROMPT.format(
        goal=goal,
        title=subtask.title,
        description=subtask.description,
        web_results=web_results,
        previous_context=previous_context
    )
    
    response = call_claude(prompt, max_tokens=1500)
    raw = extract_json(response)
    
    return SubtaskResult(
        subtask_title=raw.get("subtask_title", subtask.title),
        key_findings=raw.get("key_findings", []),
        analysis=raw.get("analysis", ""),
        metrics=raw.get("metrics", []),
        recommendation=raw.get("recommendation", ""),
        confidence_level=raw.get("confidence_level", "Medium"),
        tool_used="web_search + claude-analysis"
    )