import { useAgent } from "./hooks/useAgent"
import { useAuth } from "./hooks/useAuth"
import GoalInput from "./components/GoalInput"
import AgentTrace from "./components/AgentTrace"
import ResultPanel from "./components/ResultPanel"
import AuthPage from "./components/AuthPage"

export default function App() {
  const agent = useAgent()
  const { user, loading, login, signup, logout } = useAuth()

  // Show nothing while checking localStorage
  if (loading) return null

  // Gate: show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={login} onSignup={signup} />
  }

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

        <div className="flex items-center gap-3">
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

          {/* User info & logout */}
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <div className="w-6 h-6 bg-brand-600/20 border border-brand-600/40 
                            rounded-full flex items-center justify-center">
              <span className="text-xs text-brand-400 font-medium">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-300 hidden sm:block">{user.username}</span>
            <button
              onClick={logout}
              className="text-xs text-slate-500 hover:text-red-400 ml-1 
                         transition-colors"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
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