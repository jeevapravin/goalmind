const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export function streamAgentRun(goal, handlers) {
  const url = `${BACKEND_URL}/api/agent/run?goal=${encodeURIComponent(goal)}`
  const source = new EventSource(url)

  source.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data)
      
      switch (data.type) {
        case "status":
          handlers.onStatus?.(data)
          break
        case "subtasks_ready":
          handlers.onSubtasksReady?.(data.subtasks)
          break
        case "subtask_start":
          handlers.onSubtaskStart?.(data)
          break
        case "subtask_complete":
          handlers.onSubtaskComplete?.(data)
          break
        case "verdict_ready":
          handlers.onVerdictReady?.(data.verdict)
          break
        case "complete":
          handlers.onComplete?.()
          source.close()
          break
        case "error":
          handlers.onError?.(data.message)
          source.close()
          break
        default:
          break
      }
    } catch (e) {
      console.error("SSE parse error:", e)
    }
  }

  source.onerror = (e) => {
    handlers.onError?.("Connection to agent failed. Is the backend running?")
    source.close()
  }

  return () => source.close() // cleanup function
}