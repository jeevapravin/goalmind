import google.generativeai as genai
from app.config import settings

# Reuse the same genai configuration (already configured in gemini_client.py)
# But configure here too in case this module loads first
genai.configure(api_key=settings.gemini_api_key)

_model = None

def _get_model():
    global _model
    if _model is None:
        _model = genai.GenerativeModel('gemini-2.5-flash')
    return _model

NARRATION_PROMPT = '''
You are narrating your own reasoning process as you analyze: "{goal}"
Current step: "{step}"
Write in first person, present tense, 1-2 sentences at a time.
Be specific about what you are checking and why. Think out loud.
Start immediately. No preamble.
'''

async def stream_thinking(goal: str, step: str):
    '''Async generator yielding thinking tokens'''
    prompt = NARRATION_PROMPT.format(goal=goal, step=step)
    try:
        model = _get_model()
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=300,
                temperature=0.7
            ),
            stream=True
        )
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        yield f"[Thinking trace unavailable: {str(e)[:100]}]"
