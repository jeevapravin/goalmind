export default function SubtaskCard({ result, index }) {
  if (!result) return null

  const confidenceColor = {
    High:   "bg-green-900/40 text-green-300 border-green-700/30",
    Medium: "bg-amber-900/40 text-amber-300 border-amber-700/30",
    Low:    "bg-red-900/40 text-red-300 border-red-700/30"
  }[result.confidence_level] || "bg-slate-700 text-slate-300"

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 fade-in">
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="text-xs text-slate-500">Task {index + 1}</span>
          <h4 className="font-semibold text-brand-300 mt-0.5">
            {result.subtask_title}
          </h4>
          <span className="text-xs text-slate-500">{result.tool_used}</span>
        </div>
        <span className={`text-xs px-2.5 py-1 rounded-full border flex-shrink-0 ${confidenceColor}`}>
          {result.confidence_level}
        </span>
      </div>

      {/* Key findings */}
      <div className="mb-4">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">
          Key Findings
        </p>
        <ul className="space-y-1.5">
          {result.key_findings.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-brand-400 mt-0.5 flex-shrink-0">→</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Metrics */}
      {result.metrics?.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {result.metrics.map((m, i) => (
            <div key={i} className="bg-slate-800 rounded-xl p-3 text-center">
              <p className="text-xs text-slate-500">{m.label}</p>
              <p className="font-bold text-white mt-1 text-sm">{m.value}</p>
              {m.trend && (
                <p className={`text-xs mt-0.5 ${
                  m.trend === "growing"   ? "text-green-400" :
                  m.trend === "declining" ? "text-red-400"   : "text-slate-400"
                }`}>
                  {m.trend}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Analysis */}
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        {result.analysis}
      </p>

      {/* Recommendation */}
      <div className="bg-brand-600/10 border border-brand-600/20 rounded-xl p-3">
        <p className="text-xs text-brand-400 uppercase tracking-wider mb-1">
          Recommendation
        </p>
        <p className="text-sm text-white">{result.recommendation}</p>
      </div>
    </div>
  )
}