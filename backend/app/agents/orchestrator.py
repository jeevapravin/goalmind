import json
from app.agents.decomposer import decompose_goal
from app.agents.executor import execute_subtask
from app.tools.gemini_client import call_llm_json
from app.schemas import SubtaskResult, FinalVerdict

VERDICT_PROMPT = """You are GoalMind. You have completed all research subtasks for this goal: "{goal}"

{context_block}

All research findings:
{all_findings}

Now deliver the final executive verdict.

Return ONLY a valid JSON object:
{{
  "executive_summary": "3-4 sentence high-level summary of ALL findings combined",
  "top_opportunities": [
    "Specific opportunity 1 backed by research data",
    "Specific opportunity 2",
    "Specific opportunity 3"
  ],
  "top_risks": [
    "Specific risk 1 with reasoning",
    "Specific risk 2",
    "Specific risk 3"
  ],
  "immediate_next_steps": [
    "Concrete action step 1 for the next 30 days",
    "Concrete action step 2",
    "Concrete action step 3"
  ],
  "overall_verdict": "Go",
  "verdict_reason": "One decisive sentence explaining the verdict. Be direct.",
  "confidence_score": 78
}}

overall_verdict MUST be exactly one of: Go, No-Go, Proceed with Caution
confidence_score is an integer 0-100.
BE DECISIVE. No wishy-washy answers.
"""


def _build_context_block(ctx: dict) -> str:
    """Build a context injection block from enriched_context dict."""
    if not ctx:
        return ""
    parts = []
    if ctx.get('entity_context'):
        parts.append(f"ENTITY CONTEXT: {ctx['entity_context']}")
    if ctx.get('persona'):
        parts.append(f"PERSONA CONTEXT: {ctx['persona']} — adjust tone accordingly.")
    if ctx.get('framework_hint'):
        parts.append(f"DOMAIN FRAMEWORK: {ctx['framework_hint']}")
    if ctx.get('success_criteria'):
        parts.append(f"SUCCESS CRITERIA: {ctx['success_criteria']}")
    if ctx.get('assumptions'):
        parts.append(f"CONFIRMED ASSUMPTIONS: {ctx['assumptions']}")
    if ctx.get('mutation_modifier'):
        parts.append(f"MUTATION MODIFIER: {ctx['mutation_modifier']}")
    if ctx.get('clarification_answers'):
        answers_str = ', '.join(f"{k}: {v}" for k, v in ctx['clarification_answers'].items())
        parts.append(f"CLARIFICATION ANSWERS: {answers_str}")
    return '\n'.join(parts)


async def run_agent(goal: str, enriched_context: dict = None):
    """
    Async generator that yields SSE events.
    Each yield is a complete SSE-formatted string.
    """
    ctx = enriched_context or {}
    context_block = _build_context_block(ctx)

    def sse(event_type: str, data: dict) -> str:
        payload = json.dumps({"type": event_type, **data})
        return f"data: {payload}\n\n"

    try:
        # ── PHASE 1: Decompose ──
        yield sse("status", {"message": "Analyzing your goal...", "phase": "decompose"})
        
        subtasks = decompose_goal(goal)
        
        yield sse("subtasks_ready", {
            "subtasks": [s.model_dump() for s in subtasks]
        })

        # ── PHASE 2: Execute each subtask ──
        results: list[SubtaskResult] = []
        
        for subtask in subtasks:
            # Signal start
            yield sse("subtask_start", {
                "task_id": subtask.id,
                "title": subtask.title,
                "description": subtask.description
            })
            
            # Execute (this does web search + Gemini call)
            result = execute_subtask(subtask, goal, results, ctx)
            results.append(result)
            
            # Signal complete with full result
            yield sse("subtask_complete", {
                "task_id": subtask.id,
                "result": result.model_dump()
            })

        # ── PHASE 3: Final Verdict ──
        yield sse("status", {"message": "Generating final verdict...", "phase": "verdict"})
        
        all_findings = "\n\n".join([
            f"=== {r.subtask_title} ===\n"
            f"Findings: {chr(10).join(r.key_findings)}\n"
            f"Analysis: {r.analysis}\n"
            f"Recommendation: {r.recommendation}\n"
            f"Confidence: {r.confidence_level}"
            for r in results
        ])
        
        verdict_prompt = VERDICT_PROMPT.format(
            goal=goal,
            context_block=context_block,
            all_findings=all_findings
        )
        
        verdict_data = call_llm_json(verdict_prompt, max_tokens=4000)
        verdict = FinalVerdict(**verdict_data)
        
        yield sse("verdict_ready", {"verdict": verdict.model_dump()})
        
        # ── DONE ──
        yield sse("complete", {"message": "Analysis complete"})

    except Exception as e:
        yield sse("error", {"message": str(e)})