import { useAgent } from "./hooks/useAgent"
import GoalInput from "./components/GoalInput"
import AgentTrace from "./components/AgentTrace"
import ResultPanel from "./components/ResultPanel"

export default function App() {
  const agent = useAgent()

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center 
                          justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center 
                          justify-center text-white font-bold text-sm">G</div>
          <span className="font-bold text-white">GoalMind</span>
          <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 
                           rounded-full hidden sm:block">
            Autonomous Research Agent
          </span>
        </div>
        {agent.phase !== "idle" && (
          <button
            onClick={agent.reset}
            className="text-xs text-slate-400 hover:text-white border 
                       border-slate-700 hover:border-slate-500 px-3 py-1.5 
                       rounded-lg transition-colors"
          >
            ← New Goal
          </button>
        )}
      </header>

      {/* Error banner */}
      {agent.error && (
        <div className="bg-red-900/30 border-b border-red-700/50 px-6 py-3 
                        text-sm text-red-300">
          ⚠️ {agent.error}
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {agent.phase === "idle" && (
          <GoalInput onSubmit={agent.runAgent} />
        )}

        {(agent.phase === "running" || agent.phase === "complete") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Left: Agent Trace */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <AgentTrace
                subtasks={agent.subtasks}
                runningTaskId={agent.runningTaskId}
                subtaskResults={agent.subtaskResults}
                statusMessage={agent.statusMessage}
                phase={agent.phase}
              />
            </div>

            {/* Right: Results */}
            <ResultPanel
              subtasks={agent.subtasks}
              subtaskResults={agent.subtaskResults}
              verdict={agent.verdict}
              goal={agent.goal}
              phase={agent.phase}
            />
          </div>
        )}
      </main>
    </div>
  )
}