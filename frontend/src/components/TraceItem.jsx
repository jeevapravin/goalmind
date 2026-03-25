export default function TraceItem({ subtask, status, result }) {
  // status: "pending" | "running" | "done"
  
  return (
    <div className={`
      flex items-start gap-3 p-3 rounded-xl transition-all duration-400
      ${status === "running" ? "bg-brand-600/10 border border-brand-600/30" : ""}
      ${status === "done"    ? "bg-slate-800/60" : ""}
      ${status === "pending" ? "opacity-35" : ""}
    `}>
      {/* Status icon */}
      <div className="mt-0.5 flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {status === "done" && (
          <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        )}
        {status === "running" && (
          <div className="w-4 h-4 border-2 border-brand-400 border-t-transparent 
                          rounded-full animate-spin"/>
        )}
        {status === "pending" && (
          <div className="w-4 h-4 border-2 border-slate-600 rounded-full"/>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500">Task {subtask.id}</span>
          <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
            🔍 web search + analysis
          </span>
          {result && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              result.confidence_level === "High"   ? "bg-green-900/60 text-green-300" :
              result.confidence_level === "Medium" ? "bg-amber-900/60 text-amber-300" :
              "bg-red-900/60 text-red-300"
            }`}>
              {result.confidence_level} confidence
            </span>
          )}
        </div>
        
        <p className={`font-semibold mt-1 ${
          status === "running" ? "text-brand-300" : "text-white"
        }`}>
          {subtask.title}
        </p>
        
        <p className="text-xs text-slate-500 mt-0.5">{subtask.description}</p>
        
        {status === "running" && (
          <p className="text-xs text-brand-400 mt-1 animate-pulse">
            Searching web + analyzing...
          </p>
        )}
        
        {status === "done" && result && (
          <p className="text-xs text-green-400/70 mt-1">
            {result.key_findings.length} findings · {result.metrics.length} metrics
          </p>
        )}
      </div>
    </div>
  )
}