import { useState, useEffect, useCallback } from "react"
import {
  signup as authSignup,
  signin as authSignin,
  logout as authLogout,
  getUser,
} from "../services/authService"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = getUser()
    if (stored) setUser(stored)
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    const data = await authSignin(username, password)
    setUser({ username: data.username, id: data.user_id })
    return data
  }, [])

  const signup = useCallback(async (username, password) => {
    const data = await authSignup(username, password)
    setUser({ username: data.username, id: data.user_id })
    return data
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setUser(null)
  }, [])

  return { user, loading, login, signup, logout }
}
