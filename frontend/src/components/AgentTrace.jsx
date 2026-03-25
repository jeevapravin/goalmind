import TraceItem from "./TraceItem"

export default function AgentTrace({ 
  subtasks, runningTaskId, subtaskResults, 
  statusMessage, phase 
}) {
  const getStatus = (taskId) => {
    if (subtaskResults[taskId]) return "done"
    if (runningTaskId === taskId) return "running"
    return "pending"
  }

  const completedCount = Object.keys(subtaskResults).length
  const totalCount = subtasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-2 h-2 rounded-full ${
          phase === "complete" ? "bg-green-400" :
          phase === "running"  ? "bg-brand-400 animate-pulse" :
          "bg-slate-600"
        }`}/>
        <h3 className="font-semibold text-sm text-slate-300">Agent Trace</h3>
        <span className="text-xs text-slate-600 ml-auto">{statusMessage}</span>
      </div>

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-600 mb-1">
            <span>Execution progress</span>
            <span>{completedCount}/{totalCount} tasks</span>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Subtask list */}
      <div className="space-y-2">
        {subtasks.length === 0 && phase === "running" && (
          <div className="flex items-center gap-3 p-3">
            <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent 
                            rounded-full animate-spin flex-shrink-0"/>
            <span className="text-sm text-slate-400">Planning subtasks...</span>
          </div>
        )}

        {subtasks.map((task) => (
          <div key={task.id} className="fade-in">
            <TraceItem
              subtask={task}
              status={getStatus(task.id)}
              result={subtaskResults[task.id]}
            />
          </div>
        ))}

        {/* Verdict generation step */}
        {completedCount === totalCount && totalCount > 0 && (
          <div className={`
            flex items-center gap-3 p-3 rounded-xl fade-in
            ${phase === "complete" 
              ? "bg-green-900/20 border border-green-700/30" 
              : "bg-brand-600/10 border border-brand-600/30"}
          `}>
            {phase === "complete" ? (
              <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" 
                   viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            ) : (
              <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent 
                              rounded-full animate-spin flex-shrink-0"/>
            )}
            <div>
              <p className="text-sm font-semibold text-white">
                {phase === "complete" ? "Final report generated" : "Generating verdict..."}
              </p>
              <p className="text-xs text-slate-500">Synthesizing all findings</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}