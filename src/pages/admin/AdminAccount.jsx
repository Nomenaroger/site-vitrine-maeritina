import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { KeyRound, ShieldCheck, UserCheck, LockKeyhole, LogOut } from 'lucide-react'
import { adminRequest, clearAdminToken, getAdminToken } from '../../config/adminApi'

export default function AdminAccount() {
  const [account, setAccount] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loadingAccount, setLoadingAccount] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    adminRequest('/account')
      .then(res => setAccount(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoadingAccount(false))
  }, [])

  if (!getAdminToken()) return <Navigate to="/admin/login" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('La confirmation du nouveau mot de passe ne correspond pas.')
      return
    }

    setSaving(true)
    try {
      const res = await adminRequest('/account/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      setSuccess(res.message || 'Mot de passe modifié avec succès. Redirection vers la connexion...')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        clearAdminToken()
        navigate('/admin/login', { replace: true })
      }, 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const reconnectNow = () => {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <section>
      <div className="admin-page-heading">
        <div>
          <span className="admin-topbar-label">SÉCURITÉ & COMPTE</span>
          <h1>Gestion du compte administrateur</h1>
          <p>Consultez les informations de votre compte et modifiez votre mot de passe directement dans MySQL.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        <article className="admin-stat-card">
          <span className="admin-stat-icon"><UserCheck /></span>
          <div>
            <small>Identifiant connecté (table adminAcount)</small>
            <strong>{loadingAccount ? 'Chargement...' : (account?.username || 'admin')}</strong>
          </div>
        </article>
        <article className="admin-stat-card">
          <span className="admin-stat-icon orange"><ShieldCheck /></span>
          <div>
            <small>Dernière mise à jour du compte</small>
            <strong>
              {loadingAccount
                ? '—'
                : account?.updated_at
                  ? new Date(account.updated_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Actif'}
            </strong>
          </div>
        </article>
      </div>

      <article className="admin-welcome-card">
        <div className="admin-modal-heading">
          <div>
            <span className="admin-topbar-label">MODIFICATION DU MOT DE PASSE</span>
            <h2>Changer le mot de passe administrateur</h2>
          </div>
          <KeyRound size={22} color="var(--orange)" />
        </div>

        <p style={{ marginBottom: '20px' }}>
          Après l’enregistrement dans la base de données MySQL, votre session actuelle sera fermée afin de vous permettre de vous reconnecter avec votre nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '520px' }}>
          <div className="admin-form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <label>
              Mot de passe actuel *
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
                placeholder="Saisissez votre mot de passe actuel"
                required
              />
            </label>

            <label>
              Nouveau mot de passe *
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Minimum 6 caractères"
                minLength={6}
                required
              />
            </label>

            <label>
              Confirmer le nouveau mot de passe *
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                placeholder="Confirmez le nouveau mot de passe"
                minLength={6}
                required
              />
            </label>
          </div>

          {error && <div className="admin-alert error" style={{ marginTop: '16px' }}>{error}</div>}
          {success && (
            <div className="admin-alert success" style={{ marginTop: '16px' }}>
              <span>{success}</span>
              <button type="button" onClick={reconnectNow} title="Se reconnecter maintenant">
                <LogOut size={15} />
              </button>
            </div>
          )}

          <div className="admin-modal-actions" style={{ justifyContent: 'flex-start' }}>
            <button type="submit" className="admin-primary-button" disabled={saving}>
              <LockKeyhole size={16} />
              {saving ? 'Enregistrement en cours...' : 'Enregistrer le nouveau mot de passe'}
            </button>
          </div>
        </form>
      </article>
    </section>
  )
}
