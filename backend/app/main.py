from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.config import settings
from app.agents.orchestrator import run_agent
from app.agents.thinking_narrator import stream_thinking
from app.auth import router as auth_router
from app.routers import enhance, mutate
import json

app = FastAPI(title="GoalMind API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(enhance.router)
app.include_router(mutate.router)


@app.get("/health")
def health():
    return {"status": "ok", "service": "GoalMind API"}


# ── Agent Run (POST with enriched context) ───────────────────────

class AgentRunRequest(BaseModel):
    goal: str
    enriched_context: dict = {}


@app.post("/api/agent/run")
async def run_goal_agent(req: AgentRunRequest):
    """
    SSE endpoint. Frontend connects here via POST and receives
    real-time events as the agent executes subtasks.
    Accepts enriched_context from pre-run enhancement pipeline.
    """
    return StreamingResponse(
        run_agent(req.goal, req.enriched_context),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )


# ── Thinking Trace SSE (GET, separate stream) ─────────────────────

@app.get('/api/thinking/stream')
async def thinking_stream(goal: str = Query(...), step: str = Query(...)):
    async def generate():
        async for token in stream_thinking(goal, step):
            payload = json.dumps({'token': token})
            yield f'data: {payload}\n\n'
        yield 'data: {"done": true}\n\n'
    return StreamingResponse(
        generate(),
        media_type='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'}
    )