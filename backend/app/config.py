from pathlib import Path
from pydantic_settings import BaseSettings

# Resolve .env relative to THIS file's parent (the backend/ directory)
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"

class Settings(BaseSettings):
    gemini_api_key: str  
    tavily_api_key: str
    frontend_url: str = "http://localhost:5173"
    supabase_url: str
    supabase_key: str
    jwt_secret: str = "goalmind_jwt_secret_k8x92m_change_in_production"

    class Config:
        env_file = str(_ENV_PATH)

settings = Settings()