const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

/**
 * Stream agent run using POST fetch + ReadableStream for SSE support.
 * This replaces the old EventSource (GET-only) approach to support
 * enrichedContext in the POST body.
 */
export async function streamAgentRun(goal, enrichedContext = {}, handlers) {
  const url = `${BACKEND_URL}/api/agent/run`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, enriched_context: enrichedContext })
    })

    if (!response.ok) {
      handlers.onError?.(`Server error: ${response.status}`)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop() // keep incomplete chunk in buffer

      for (const part of parts) {
        if (!part.startsWith('data: ')) continue
        try {
          const data = JSON.parse(part.slice(6))
          switch (data.type) {
            case 'status':
              handlers.onStatus?.(data)
              break
            case 'subtasks_ready':
              handlers.onSubtasksReady?.(data.subtasks)
              break
            case 'subtask_start':
              handlers.onSubtaskStart?.(data)
              break
            case 'subtask_complete':
              handlers.onSubtaskComplete?.(data)
              break
            case 'verdict_ready':
              handlers.onVerdictReady?.(data.verdict)
              break
            case 'complete':
              handlers.onComplete?.()
              return
            case 'error':
              handlers.onError?.(data.message)
              return
            default:
              break
          }
        } catch (e) {
          console.error('SSE parse error:', e)
        }
      }
    }
  } catch (e) {
    handlers.onError?.("Connection to agent failed. Is the backend running?")
  }
}

/**
 * Stream a mutation run using POST fetch + ReadableStream for SSE support.
 */
export async function streamMutationRun(goal, mutationKey, enrichedContext = {}, handlers) {
  const url = `${BACKEND_URL}/api/mutate/run`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, mutation_key: mutationKey, enriched_context: enrichedContext })
    })

    if (!response.ok) {
      handlers.onError?.(`Server error: ${response.status}`)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split('\n\n')
      buffer = parts.pop()

      for (const part of parts) {
        if (!part.startsWith('data: ')) continue
        try {
          const data = JSON.parse(part.slice(6))
          switch (data.type) {
            case 'status':
              handlers.onStatus?.(data)
              break
            case 'subtasks_ready':
              handlers.onSubtasksReady?.(data.subtasks)
              break
            case 'subtask_start':
              handlers.onSubtaskStart?.(data)
              break
            case 'subtask_complete':
              handlers.onSubtaskComplete?.(data)
              break
            case 'verdict_ready':
              handlers.onVerdictReady?.(data.verdict)
              break
            case 'complete':
              handlers.onComplete?.()
              return
            case 'error':
              handlers.onError?.(data.message)
              return
            default:
              break
          }
        } catch (e) {
          console.error('SSE parse error:', e)
        }
      }
    }
  } catch (e) {
    handlers.onError?.("Connection to agent failed. Is the backend running?")
  }
}