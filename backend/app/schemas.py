from pydantic import BaseModel
from typing import List, Optional

class GoalRequest(BaseModel):
    goal: str

class Metric(BaseModel):
    label: str
    value: str
    trend: Optional[str] = None

class SubtaskResult(BaseModel):
    subtask_title: str
    key_findings: List[str]
    analysis: str
    metrics: List[Metric] = []
    recommendation: str
    confidence_level: str  # High | Medium | Low
    tool_used: str = "web_search + analysis"

class FinalVerdict(BaseModel):
    executive_summary: str
    top_opportunities: List[str]
    top_risks: List[str]
    immediate_next_steps: List[str]
    overall_verdict: str  # Go | No-Go | Proceed with Caution
    verdict_reason: str
    confidence_score: int  # 0-100

class SubtaskDefinition(BaseModel):
    id: int
    title: str
    description: str
    search_query: str