MUTATION_MODIFIERS = {
    'skeptical': '''Adopt a devil's advocate perspective throughout.
Challenge every positive assumption. Surface hidden risks.
Be more critical than constructive. Assume failure modes first.''',

    'financial': '''Add detailed financial projections to every section.
Include revenue model, unit economics, CAC/LTV estimates,
burn rate assumptions, and 12-month P&L forecast where applicable.''',

    'vc_lens': '''Reframe everything for a Series A VC reader.
Use investor-standard framing: TAM/SAM/SOM, moat, unfair advantage,
team-market fit, 10x opportunity signal. Be terse and numbers-first.''',

    'simplify': '''Simplify completely for a non-technical reader.
No jargon. No acronyms without explanation. Use analogies.
Write as if explaining to a smart 16-year-old.''',
}

def get_mutation_modifier(key: str) -> str:
    return MUTATION_MODIFIERS.get(key, '')
