import { useState, useCallback, useRef } from "react"
import { streamAgentRun, streamMutationRun } from "../services/agentService"

export function useAgent() {
  const [phase, setPhase] = useState("idle") // idle | running | complete | error
  const [goal, setGoal] = useState("")
  const [subtasks, setSubtasks] = useState([])
  const [subtaskResults, setSubtaskResults] = useState({})
  const [runningTaskId, setRunningTaskId] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [statusMessage, setStatusMessage] = useState("")
  const [error, setError] = useState(null)
  const [isMutating, setIsMutating] = useState(false)
  const abortRef = useRef(null)

  const handlers = {
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
      setIsMutating(false)
    },
    onError: (msg) => {
      setError(msg)
      setPhase("error")
      setIsMutating(false)
    }
  }

  const runAgent = useCallback(async (goalText, enrichedContext = {}) => {
    setGoal(goalText)
    setPhase("running")
    setSubtasks([])
    setSubtaskResults({})
    setRunningTaskId(null)
    setVerdict(null)
    setError(null)
    setStatusMessage("Connecting to agent...")

    await streamAgentRun(goalText, enrichedContext, handlers)
  }, [])

  const runMutation = useCallback(async (mutationKey, enrichedContext = {}) => {
    setIsMutating(true)
    setPhase("running")
    setSubtasks([])
    setSubtaskResults({})
    setRunningTaskId(null)
    setVerdict(null)
    setError(null)
    setStatusMessage(`Reframing report (${mutationKey})...`)

    await streamMutationRun(goal, mutationKey, enrichedContext, handlers)
  }, [goal])

  const reset = useCallback(() => {
    setPhase("idle")
    setGoal("")
    setSubtasks([])
    setSubtaskResults({})
    setRunningTaskId(null)
    setVerdict(null)
    setStatusMessage("")
    setError(null)
    setIsMutating(false)
  }, [])

  return {
    phase, goal, subtasks, subtaskResults,
    runningTaskId, verdict, statusMessage, error,
    isMutating,
    runAgent, runMutation, reset
  }
}