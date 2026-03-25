from tavily import TavilyClient
from app.config import settings

tavily = TavilyClient(api_key=settings.tavily_api_key)

def search_web(query: str) -> str:
    try:
        results = tavily.search(
            query=query,
            search_depth="basic",
            max_results=3
        )
        if not results.get("results"):
            return "No web results found."
        
        formatted = []
        for r in results["results"][:3]:
            formatted.append(
                f"Source: {r.get('title', 'Unknown')}\n"
                f"URL: {r.get('url', '')}\n"
                f"Content: {r.get('content', '')[:400]}"
            )
        return "\n\n".join(formatted)
    except Exception as e:
        return f"Web search failed: {str(e)}"