import google.generativeai as genai
import json
import re
import time
from app.config import settings

# Configure the Gemini client
genai.configure(api_key=settings.gemini_api_key)

# Initialize model
model = genai.GenerativeModel('gemini-2.5-flash')

def call_llm_json(prompt: str, max_tokens: int = 4000) -> dict | list:
    """
    Calls Gemini and extracts JSON, retrying up to 3 times for rate limits OR invalid JSON output.
    """
    for attempt in range(3):
        try:
            time.sleep(2) 
            
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_tokens,
                    temperature=0.1, 
                    response_mime_type="application/json", 
                )
            )
            text = response.text
            
            # JSON EXTRACTION
            try:
                parsed = json.loads(text)
                if isinstance(parsed, str):
                    parsed = json.loads(parsed)
                return parsed
            except json.JSONDecodeError:
                sanitized = re.sub(r"```json|```", "", text).strip()
                match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", sanitized)
                if not match:
                    raise ValueError("No JSON found in LLM output")
                parsed = json.loads(match.group(1))
                if isinstance(parsed, str):
                    parsed = json.loads(parsed)
                return parsed

        except Exception as e:
            error_msg = str(e).lower()
            if "429" in error_msg or "quota" in error_msg:
                print(f"[!] Rate limited by Gemini. Retrying in 5 seconds... (Attempt {attempt + 1}/3)")
                time.sleep(5)
            elif attempt < 2:
                print(f"[!] Invalid JSON or error generated. Retrying... (Attempt {attempt + 1}/3). Error: {e}")
                time.sleep(2)
            else:
                raise e
                
    raise Exception("Gemini API failed after 3 attempts.")