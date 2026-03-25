from supabase import create_client
from app.config import settings

_client = None

def get_supabase():
    """Lazy-initialize the Supabase client (avoids crash at import time)."""
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_key)
    return _client
