import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LockKeyhole, Store } from 'lucide-react'
import { adminRequest, setAdminToken } from '../../config/adminApi'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const result = await adminRequest('/login', { method: 'POST', body: JSON.stringify({ username, password }) })
      setAdminToken(result.token); navigate('/admin', { replace: true })
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }
  return <div className="admin-login-page"><form className="admin-login-card" onSubmit={submit}>
    <div className="admin-login-logo"><Store size={28}/></div>
    <span className="admin-topbar-label">MAERITINA QUINCAILLERIE</span>
    <h1>Administration</h1><p>Connectez-vous pour gérer les produits et les prix.</p>
    <label>Identifiant<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username" required/></label>
    <label>Mot de passe<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password" required/></label>
    {error && <div className="admin-alert error">{error}</div>}
    <button className="admin-primary-button" disabled={loading}><LockKeyhole size={17}/>{loading ? 'Connexion...' : 'Se connecter'}</button>
    <a href="/" className="admin-back-link">Retour au site</a>
  </form></div>
}
