import { useState, useEffect } from "react"

const EXAMPLES = [
  "Analyze my startup: AI-powered medicine delivery for rural villages in India",
  "Evaluate business proposal: cloud kitchen chain targeting college campuses",
  "Plan a product launch for a student mental health app in Tier-2 cities",
]

export default function GoalInput({ onSubmit }) {
  const [goal, setGoal] = useState("")
  const [placeholder, setPlaceholder] = useState("")
  const [exampleIdx, setExampleIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  // Typewriter effect for placeholder
  useEffect(() => {
    const example = EXAMPLES[exampleIdx]
    if (charIdx < example.length) {
      const t = setTimeout(() => {
        setPlaceholder(example.slice(0, charIdx + 1))
        setCharIdx(c => c + 1)
      }, 35)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setCharIdx(0)
        setExampleIdx(i => (i + 1) % EXAMPLES.length)
        setPlaceholder("")
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [charIdx, exampleIdx])

  const handleSubmit = () => {
    if (goal.trim().length < 10) return
    onSubmit(goal.trim())
  }

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">G</span>
        </div>
        <span className="text-2xl font-bold text-white">GoalMind</span>
        <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-full">
          Agentic AI
        </span>
      </div>

      <h1 className="text-4xl font-bold text-center mb-3 text-white">
        What's your <span className="text-brand-400">goal?</span>
      </h1>
      <p className="text-slate-400 text-center mb-10 max-w-lg">
        Type any business goal. GoalMind autonomously researches, analyzes, 
        and delivers a full action report — no prompting required.
      </p>

      {/* Input */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 
                      rounded-2xl p-4 focus-within:border-brand-500 transition-colors">
        <textarea
          className="w-full bg-transparent text-white text-lg 
                     outline-none resize-none placeholder-slate-600"
          placeholder={goal ? "" : (placeholder || "Type your goal here...")}
          rows={3}
          value={goal}
          onChange={e => setGoal(e.target.value)}
          onKeyDown={handleKey}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs text-slate-600">Ctrl+Enter to launch</span>
          <button
            onClick={handleSubmit}
            disabled={goal.trim().length < 10}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-40 
                       disabled:cursor-not-allowed px-6 py-2.5 rounded-xl 
                       font-semibold text-white transition-colors flex items-center gap-2"
          >
            Launch Agent →
          </button>
        </div>
      </div>

      {/* Quick examples */}
      <div className="mt-8 w-full max-w-2xl">
        <p className="text-xs text-slate-600 mb-3 text-center">Try an example:</p>
        <div className="flex flex-col gap-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => setGoal(ex)}
              className="text-sm text-slate-400 hover:text-brand-400 text-left
                         px-4 py-2.5 border border-slate-800 hover:border-brand-700 
                         rounded-xl transition-colors">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}