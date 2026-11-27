const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/$/, '')

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.message || 'Une erreur est survenue lors de la communication avec le serveur.')
  return payload
}

export function resolveProductImage(imagePath) {
  if (!imagePath) return ''
  if (/^(https?:)?\/\//i.test(imagePath) || imagePath.startsWith('data:')) return imagePath
  const serverBase = API_BASE_URL.replace(/\/api\/?$/, '')
  return `${serverBase}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`
}
