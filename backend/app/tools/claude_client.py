import anthropic
import json
import re
from app.config import settings

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

def call_claude(prompt: str, max_tokens: int = 2000) -> str:
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=max_tokens,
        messages=[{"role": "user", "content": prompt}]
    )
    return message.content[0].text

def extract_json(text: str) -> dict | list:
    # Strip markdown code fences if present
    text = re.sub(r"```json|```", "", text).strip()
    # Extract first JSON object or array
    match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", text)
    if not match:
        raise ValueError(f"No JSON found in Claude response: {text[:200]}")
    return json.loads(match.group(1))