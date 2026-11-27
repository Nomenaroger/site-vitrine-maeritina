const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')
const TOKEN_KEY = 'maeritina_admin_token'

export const getAdminToken = () => sessionStorage.getItem(TOKEN_KEY)
export const setAdminToken = token => sessionStorage.setItem(TOKEN_KEY, token)
export const clearAdminToken = () => sessionStorage.removeItem(TOKEN_KEY)

export async function adminRequest(path, options = {}) {
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData
  const headers = { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), ...(options.headers || {}) }
  const token = getAdminToken()
  if (token) headers.Authorization = `Bearer ${token}`
  const response = await fetch(`${API_BASE}/admin${path}`, { ...options, headers })
  const payload = await response.json().catch(() => ({}))
  if (response.status === 401 && path !== '/login' && path !== '/account/password') clearAdminToken()
  if (!response.ok) throw new Error(payload.message || 'Une erreur est survenue.')
  return payload
}
