import sys
import traceback
sys.path.append(".")
from app.agents.decomposer import DECOMPOSE_PROMPT
from app.tools.gemini_client import call_llm, extract_json

prompt = DECOMPOSE_PROMPT.format(goal="Analyze a cloud kitchen startup in Bangalore")
print("calling llm...")
resp = call_llm(prompt, 1000)
print("RAW RESPONSE:")
print(repr(resp))

print("EXTRACTING JSON:")
try:
    res = extract_json(resp)
    print("SUCCESS! Type:", type(res))
except Exception as e:
    print("FAILED!")
    traceback.print_exc()
