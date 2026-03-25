import { useAgent } from "./hooks/useAgent"
import { useAuth } from "./hooks/useAuth"
import { useEnhancement } from "./hooks/useEnhancement"
import GoalInput from "./components/GoalInput"
import AgentTrace from "./components/AgentTrace"
import ResultPanel from "./components/ResultPanel"
import AuthPage from "./components/AuthPage"
import PersonaCard from "./components/PersonaCard"
import IntentTree from "./components/IntentTree"
import DomainBadge from "./components/DomainBadge"
import AssumptionEditor from "./components/AssumptionEditor"
import ClarificationFlow from "./components/ClarificationFlow"
import SkipTrust from "./components/SkipTrust"
import ThinkingTrace from "./components/ThinkingTrace"

export default function App() {
  const agent = useAgent()
  const { user, loading, login, signup, logout } = useAuth()
  const enh = useEnhancement()

  // Show nothing while checking localStorage
  if (loading) return null

  // Gate: show auth page if not logged in
  if (!user) {
    return <AuthPage onLogin={login} onSignup={signup} />
  }

  // ── Handlers ──────────────────────────────────────────────────
  const handleGoalSubmit = async (goalText) => {
    agent.reset()
    await enh.runEnhancement(goalText)
    // enh.stage will move to 'clarifying' or 'confirmed'
  }

  const handleRunAgent = () => {
    const ctx = enh.buildContext()
    agent.runAgent(enh.rawGoal, ctx)
  }

  const handleMutate = (mutationKey) => {
    const ctx = enh.buildContext()
    agent.runMutation(mutationKey, ctx)
  }

  const handleNewGoal = () => {
    agent.reset()
    enh.reset()
  }

  // Determine what phase we're in for rendering
  const isEnhancing = enh.stage !== 'idle' && agent.phase === 'idle'
  const isAgentActive = agent.phase === 'running' || agent.phase === 'complete'

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
          {/* Domain badge next to title */}
          {enh.domain && isEnhancing && (
            <DomainBadge domain={enh.domain.domain} label={enh.domain.label} />
          )}
        </div>

        <div className="flex items-center gap-3">
          {(isEnhancing || isAgentActive) && (
            <button
              onClick={handleNewGoal}
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
      <main className={`max-w-7xl mx-auto px-4 py-6 ${
        isAgentActive ? 'pr-4 lg:pr-84' : ''
      }`}>

        {/* ── IDLE: Show GoalInput ── */}
        {enh.stage === 'idle' && agent.phase === 'idle' && (
          <GoalInput onSubmit={handleGoalSubmit} />
        )}

        {/* ── DETECTING: Loading spinner ── */}
        {enh.stage === 'detecting' && (
          <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 fade-in">
            <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent 
                            rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Understanding your goal...</p>
            <p className="text-xs text-slate-600">
              Detecting persona · Classifying domain · Extracting entities
            </p>
          </div>
        )}

        {/* ── CLARIFYING: Show enhancement results + questions ── */}
        {enh.stage === 'clarifying' && (
          <div className="max-w-2xl mx-auto space-y-4 fade-in">
            <PersonaCard data={enh.persona} onDismiss={() => {}} />
            <IntentTree intent={enh.intent} />
            
            {enh.assumptions && enh.assumptions.length > 0 && (
              <AssumptionEditor 
                assumptions={enh.assumptions} 
                onFlip={() => {}} 
                onConfirm={() => {}} 
              />
            )}

            <ClarificationFlow 
              questions={enh.clarifications} 
              onComplete={(answers, skipped) => {
                enh.handleClarificationComplete(answers, skipped)
              }}
            />
          </div>
        )}

        {/* ── CONFIRMED: Show summary + Run button ── */}
        {enh.stage === 'confirmed' && agent.phase === 'idle' && (
          <div className="max-w-2xl mx-auto space-y-4 fade-in">
            <PersonaCard data={enh.persona} onDismiss={() => {}} />
            <IntentTree intent={enh.intent} />

            <SkipTrust
              answers={enh.confirmedAnswers}
              skippedIds={enh.skippedIds}
              questions={enh.clarifications}
              onEdit={() => {}}
              onRun={handleRunAgent}
            />
          </div>
        )}

        {/* ── RUNNING / COMPLETE: Agent trace + results ── */}
        {isAgentActive && (
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
              persona={enh.persona}
              rawInput={enh.rawGoal || agent.goal}
              enrichedPrompt={enh.enrichedPrompt}
              onMutate={handleMutate}
              isMutating={agent.isMutating}
            />
          </div>
        )}
      </main>

      {/* ThinkingTrace sidebar — shown during running phase */}
      {isAgentActive && (
        <ThinkingTrace
          goal={agent.goal}
          currentStep={agent.statusMessage}
          isActive={agent.phase === 'running'}
        />
      )}
    </div>
  )
}