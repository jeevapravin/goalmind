import { useState, useCallback, useRef } from "react"
import { streamAgentRun } from "../services/agentService"

export function useAgent() {
  const [phase, setPhase] = useState("idle") // idle | running | complete | error
  const [goal, setGoal] = useState("")
  const [subtasks, setSubtasks] = useState([])
  const [subtaskResults, setSubtaskResults] = useState({})
  const [runningTaskId, setRunningTaskId] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState(null)
  const cleanupRef = useRef(null)

  const runAgent = useCallback((goalText) => {
    setGoal(goalText)
    setPhase("running")
    setSubtasks([])
    setSubtaskResults({})
    setRunningTaskId(null)
    setVerdict(null)
    setError(null)
    setStatusMessage("Connecting to agent...")

    const cleanup = streamAgentRun(goalText, {
      onStatus: (data) => {
        setStatusMessage(data.message)
      },
      onSubtasksReady: (tasks) => {
        setSubtasks(tasks)
        setStatusMessage("Subtasks ready. Executing...")
      },
      onSubtaskStart: (data) => {
        setRunningTaskId(data.task_id)
        setStatusMessage(`Executing: ${data.title}`)
      },
      onSubtaskComplete: (data) => {
        setSubtaskResults(prev => ({
          ...prev,
          [data.task_id]: data.result
        }))
      },
      onVerdictReady: (verdictData) => {
        setVerdict(verdictData)
        setRunningTaskId(null)
        setStatusMessage("Verdict ready")
      },
      onComplete: () => {
        setPhase("complete")
        setStatusMessage("Analysis complete")
      },
      onError: (msg) => {
        setError(msg)
        setPhase("error")
      }
    })

    cleanupRef.current = cleanup
  }, [])

  const reset = useCallback(() => {
    cleanupRef.current?.()
    setPhase("idle")
    setGoal("")
    setSubtasks([])
    setSubtaskResults({})
    setRunningTaskId(null)
    setVerdict(null)
    setStatusMessage("")
    setError(null)
  }, [])

  return {
    phase, goal, subtasks, subtaskResults,
    runningTaskId, verdict, statusMessage, error,
    runAgent, reset
  }
}