export default function VerdictBanner({ verdict }) {
  if (!verdict) return null

  const config = {
    "Go": {
      bg: "bg-green-900/30",
      border: "border-green-600/40",
      badge: "bg-green-500",
      icon: "🟢",
      textColor: "text-green-300"
    },
    "No-Go": {
      bg: "bg-red-900/30",
      border: "border-red-600/40",
      badge: "bg-red-500",
      icon: "🔴",
      textColor: "text-red-300"
    },
    "Proceed with Caution": {
      bg: "bg-amber-900/30",
      border: "border-amber-600/40",
      badge: "bg-amber-500",
      icon: "🟡",
      textColor: "text-amber-300"
    }
  }[verdict.overall_verdict] || {}

  return (
    <div className={`${config.bg} ${config.border} border rounded-2xl p-5 fade-in`}>
      {/* Verdict header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
            Agent Verdict
          </p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <span className={`text-2xl font-bold ${config.textColor}`}>
              {verdict.overall_verdict}
            </span>
          </div>
          <p className="text-sm text-slate-300 mt-1">{verdict.verdict_reason}</p>
        </div>
        {/* Confidence score ring */}
        <div className="text-center flex-shrink-0">
          <div className={`w-16 h-16 rounded-full border-4 
            ${verdict.confidence_score >= 70 ? "border-green-500" :
              verdict.confidence_score >= 40 ? "border-amber-500" : "border-red-500"}
            flex items-center justify-center`}>
            <span className="text-lg font-bold text-white">
              {verdict.confidence_score}%
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">confidence</p>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-slate-300 mb-4 leading-relaxed">
        {verdict.executive_summary}
      </p>

      {/* Three columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-green-400 uppercase tracking-wider mb-2">
            Opportunities
          </p>
          <ul className="space-y-1">
            {verdict.top_opportunities.map((o, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                <span className="text-green-400 flex-shrink-0">+</span>{o}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-red-400 uppercase tracking-wider mb-2">
            Risks
          </p>
          <ul className="space-y-1">
            {verdict.top_risks.map((r, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                <span className="text-red-400 flex-shrink-0">!</span>{r}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">
            Next Steps
          </p>
          <ul className="space-y-1">
            {verdict.immediate_next_steps.map((s, i) => (
              <li key={i} className="text-xs text-slate-300 flex gap-1.5">
                <span className="text-blue-400 flex-shrink-0">{i+1}.</span>{s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}