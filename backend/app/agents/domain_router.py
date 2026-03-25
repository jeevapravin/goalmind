from app.tools.gemini_client import call_llm_json

DOMAINS = [
    'startup_validation', 'market_research',
    'career_decision', 'product_design',
    'personal_finance', 'content_strategy'
]

DOMAIN_TEMPLATES = {
    'startup_validation': 'Apply TAM/SAM/SOM analysis, competitor benchmarking, go/no-go scorecard, unit economics, and funding landscape framing.',
    'market_research': 'Apply PESTLE analysis, trend signal detection, demographic profiling, and demand forecasting.',
    'career_decision': 'Apply skill-gap analysis, salary benchmarking, industry outlook, and 90-day action planning.',
    'product_design': 'Apply Jobs-to-be-Done framework, user problem mapping, feature prioritization matrix, and launch checklist.',
    'personal_finance': 'Apply cash-flow modelling, risk/return comparison, scenario planning (bear/base/bull), and timeline milestones.',
    'content_strategy': 'Apply audience persona mapping, content-market fit, channel selection, and 30-day content calendar.',
}

DOMAIN_LABELS = {
    'startup_validation': 'Startup Validation',
    'market_research':    'Market Research',
    'career_decision':    'Career Decision',
    'product_design':     'Product Design',
    'personal_finance':   'Personal Finance',
    'content_strategy':   'Content Strategy',
}

DOMAIN_PROMPT = '''
Classify this input into exactly one domain key.
Input: "{goal}"
Domains: {domains}
Return ONLY valid JSON: {{"domain": "startup_validation", "confidence": 0.91}}
'''

def classify_domain(goal: str) -> dict:
    prompt = DOMAIN_PROMPT.format(goal=goal, domains=str(DOMAINS))
    result = call_llm_json(prompt, max_tokens=200)
    domain = result.get('domain', 'startup_validation')
    return {
        'domain': domain,
        'label':  DOMAIN_LABELS.get(domain, domain),
        'confidence': result.get('confidence', 0.8),
        'framework_hint': DOMAIN_TEMPLATES.get(domain, '')
    }
