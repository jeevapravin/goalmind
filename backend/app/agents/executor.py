from app.tools.gemini_client import call_llm_json
from app.tools.tavily_tool import search_web
from app.schemas import SubtaskDefinition, SubtaskResult

EXECUTE_PROMPT = """You are GoalMind executing a specific research subtask.

{context_block}

ORIGINAL USER GOAL: "{goal}"

CURRENT SUBTASK: "{title}"
WHAT TO DO: "{description}"

LIVE WEB SEARCH RESULTS (use these for real current data):
{web_results}

{benchmark_block}

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
{mode_instruction}
"""

# Feature 10: Adaptive Depth Mode
EXPLAIN_MODE_ADDITION = '''
After every technical term or metric, add a parenthetical plain-English explanation
in brackets e.g. TAM (total addressable market — the full universe of potential customers).
Assume zero domain knowledge. Write for a first-time founder.
'''

DENSE_MODE_ADDITION = '''
Be maximally dense. No definitions, no scaffolding, no parentheticals.
Assume expert reader. Use compact bullet reasoning. Lead with numbers.
'''


def execute_subtask(
    subtask: SubtaskDefinition,
    goal: str,
    previous_results: list[SubtaskResult],
    enriched_context: dict = None
) -> SubtaskResult:
    ctx = enriched_context or {}

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

    # Build enriched context block
    context_block = ""
    if ctx:
        parts = []
        if ctx.get('entity_context'):
            parts.append(f"ENTITY CONTEXT: {ctx['entity_context']}")
            parts.append("When referencing the startup/product, always use its exact name from ENTITY CONTEXT.")
        if ctx.get('persona'):
            parts.append(f"PERSONA CONTEXT: {ctx['persona']} — adjust tone accordingly.")
        if ctx.get('assumptions'):
            parts.append(f"CONFIRMED ASSUMPTIONS: {ctx['assumptions']}")
        if ctx.get('framework_hint'):
            parts.append(f"DOMAIN FRAMEWORK: {ctx['framework_hint']}")
        if ctx.get('success_criteria'):
            parts.append(f"SUCCESS CRITERIA: {ctx['success_criteria']}")
        if ctx.get('mutation_modifier'):
            parts.append(f"MUTATION MODIFIER: {ctx['mutation_modifier']}")
        context_block = '\n'.join(parts)

    # Feature 10: Output mode
    output_mode = ctx.get('output_mode', 'dense')
    mode_instruction = EXPLAIN_MODE_ADDITION if output_mode == 'explain' else DENSE_MODE_ADDITION

    # Feature 11: Peer Benchmarking
    benchmark_block = ""
    IS_BENCHMARK_TASK = any(kw in subtask.title.lower()
        for kw in ['competitor', 'benchmark', 'market', 'landscape'])
    
    if IS_BENCHMARK_TASK:
        try:
            domain = ctx.get('domain', 'startup')
            benchmark_query = f'{domain} startup India seed funding 2023 2024 raised'
            benchmark_results = search_web(benchmark_query)
            benchmark_summary_prompt = f'''
From these search results, extract 3 real companies in this space.
Results: {benchmark_results}
Return JSON array: [{{"name": "str", "stage": "str", "key_metric": "str", "relevance": "str"}}]
'''
            benchmarks = call_llm_json(benchmark_summary_prompt, max_tokens=800)
            if isinstance(benchmarks, list) and len(benchmarks) > 0:
                benchmark_block = 'PEER BENCHMARKS (real companies, use by name in analysis):\n'
                benchmark_block += '\n'.join(
                    f'- {b.get("name", "Unknown")}: {b.get("stage", "N/A")} — {b.get("key_metric", "N/A")}'
                    for b in benchmarks
                )
        except Exception:
            benchmark_block = ""

    # Step 3: Execute with Gemini
    prompt = EXECUTE_PROMPT.format(
        goal=goal,
        title=subtask.title,
        description=subtask.description,
        web_results=web_results,
        previous_context=previous_context,
        context_block=context_block,
        benchmark_block=benchmark_block,
        mode_instruction=mode_instruction
    )
    
    raw = call_llm_json(prompt, max_tokens=4000)
    
    return SubtaskResult(
        subtask_title=raw.get("subtask_title", subtask.title),
        key_findings=raw.get("key_findings", []),
        analysis=raw.get("analysis", ""),
        metrics=raw.get("metrics", []),
        recommendation=raw.get("recommendation", ""),
        confidence_level=raw.get("confidence_level", "Medium"),
        tool_used="web_search + claude-analysis"
    )