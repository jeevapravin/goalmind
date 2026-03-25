import { useState } from "react"

export default function AuthPage({ onLogin, onSignup }) {
  const [mode, setMode] = useState("signin") // signin | signup
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)
    try {
      if (mode === "signup") {
        await onSignup(username.trim(), password)
      } else {
        await onLogin(username.trim(), password)
      }
    } catch (err) {
      setError(err.message || "Authentication failed")
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] 
                        bg-brand-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] 
                        bg-indigo-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center 
                          justify-center text-white font-bold text-lg shadow-lg 
                          shadow-brand-600/30">
            G
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">GoalMind</span>
        </div>

        {/* Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 
                        rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-xl font-semibold text-white text-center mb-1">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="text-sm text-slate-400 text-center mb-6">
            {mode === "signin"
              ? "Sign in to continue to GoalMind"
              : "Get started with GoalMind"}
          </p>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 
                            mb-5 text-sm text-red-400 flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="auth-username" className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <input
                id="auth-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 
                           text-white placeholder-slate-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-600/50 
                           focus:border-brand-600 transition-all duration-200"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 
                           text-white placeholder-slate-500 text-sm
                           focus:outline-none focus:ring-2 focus:ring-brand-600/50 
                           focus:border-brand-600 transition-all duration-200"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-50 
                         disabled:cursor-not-allowed text-white font-medium py-3 
                         rounded-xl transition-all duration-200 text-sm
                         shadow-lg shadow-brand-600/25 hover:shadow-brand-600/40
                         active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                mode === "signin" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <span className="text-sm text-slate-500">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
            </span>
            <button
              onClick={toggleMode}
              className="text-sm text-brand-400 hover:text-brand-300 ml-1.5 
                         font-medium transition-colors"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-slate-600 text-center mt-6">
          Autonomous Research Agent · Powered by AI
        </p>
      </div>
    </div>
  )
}
