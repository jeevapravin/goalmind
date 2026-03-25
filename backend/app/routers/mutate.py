from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.agents.orchestrator import run_agent
from app.agents.mutation_engine import get_mutation_modifier

router = APIRouter(prefix='/api/mutate', tags=['mutate'])


class MutateRequest(BaseModel):
    goal: str
    mutation_key: str
    enriched_context: dict = {}


@router.post('/run')
async def mutate_run(req: MutateRequest):
    modifier = get_mutation_modifier(req.mutation_key)
    enriched = {**req.enriched_context, 'mutation_modifier': modifier}
    return StreamingResponse(
        run_agent(req.goal, enriched),
        media_type='text/event-stream',
        headers={'Cache-Control': 'no-cache', 'X-Accel-Buffering': 'no'}
    )
