from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.config import settings
from app.agents.orchestrator import run_agent
from app.auth import router as auth_router

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

@app.get("/health")
def health():
    return {"status": "ok", "service": "GoalMind API"}

@app.get("/api/agent/run")
async def run_goal_agent(goal: str = Query(..., min_length=10)):
    """
    SSE endpoint. Frontend connects here and receives
    real-time events as the agent executes subtasks.
    """
    return StreamingResponse(
        run_agent(goal),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        }
    )