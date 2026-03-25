const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

async function authFetch(url, body) {
  let res
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
  } catch (e) {
    throw new Error("Cannot reach the server. Is the backend running?")
  }

  if (!res.ok) {
    let detail = "Authentication failed"
    try {
      const err = await res.json()
      detail = err.detail || detail
    } catch {}
    throw new Error(detail)
  }

  const data = await res.json()
  localStorage.setItem("gm_token", data.token)
  localStorage.setItem("gm_user", JSON.stringify({ username: data.username, id: data.user_id }))
  return data
}

export function signup(username, password) {
  return authFetch(`${BACKEND_URL}/api/auth/signup`, { username, password })
}

export function signin(username, password) {
  return authFetch(`${BACKEND_URL}/api/auth/signin`, { username, password })
}

export function logout() {
  localStorage.removeItem("gm_token")
  localStorage.removeItem("gm_user")
}

export function getToken() {
  return localStorage.getItem("gm_token")
}

export function getUser() {
  const raw = localStorage.getItem("gm_user")
  return raw ? JSON.parse(raw) : null
}
