import { useState } from "react"
import SubtaskCard from "./SubtaskCard"
import VerdictBanner from "./VerdictBanner"
import PDFExport from "./PDFExport"
import PromptDiff from "./PromptDiff"
import MutationBar from "./MutationBar"
import PersonaMirror from "./PersonaMirror"

export default function ResultPanel({ 
  subtasks, subtaskResults, verdict, goal, phase,
  persona, rawInput, enrichedPrompt, onMutate, isMutating
}) {
  const [outputMode, setOutputMode] = useState('dense')

  const completedResults = subtasks
    .map(t => subtaskResults[t.id])
    .filter(Boolean)

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Top bar */}
      {(completedResults.length > 0 || verdict) && (
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Analyzing</p>
            <p className="text-sm text-white font-medium truncate max-w-xs">
              {goal}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Output mode toggle (Feature 10) */}
            <button
              onClick={() => setOutputMode(m => m === 'dense' ? 'explain' : 'dense')}
              className='text-xs border border-slate-700 px-3 py-1.5 rounded-lg
                text-slate-400 hover:text-white transition-colors'>
              {outputMode === 'dense' ? '📖 Explain Mode' : '⚡ Expert Mode'}
            </button>
            <PDFExport
              goal={goal}
              subtaskResults={subtaskResults}
              verdict={verdict}
              disabled={phase !== "complete"}
            />
          </div>
        </div>
      )}

      {/* Scrollable report content */}
      <div
        id="report-content"
        className="space-y-4 overflow-y-auto flex-1 pr-1"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {/* Verdict first (most important) */}
        {verdict && (
          <VerdictBanner verdict={verdict} />
        )}

        {/* Subtask cards */}
        {completedResults.map((result, i) => (
          <SubtaskCard key={i} result={result} index={i} />
        ))}

        {/* Empty state */}
        {completedResults.length === 0 && phase === "running" && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent 
                            rounded-full animate-spin"/>
            <p className="text-slate-500 text-sm">
              First results will appear here shortly...
            </p>
          </div>
        )}

        {/* Post-completion features */}
        {phase === "complete" && (
          <>
            {/* Feature 14: Mutation Bar */}
            <MutationBar onMutate={onMutate} isLoading={isMutating} />

            {/* Feature 13: Prompt Diff */}
            <PromptDiff rawInput={rawInput} enrichedPrompt={enrichedPrompt} />
            
            {/* Bonus: Persona Mirror */}
            <PersonaMirror persona={persona} />
          </>
        )}
      </div>
    </div>
  )
}