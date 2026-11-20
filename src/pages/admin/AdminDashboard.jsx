import { useEffect, useState } from 'react'
import { Package, Tags, ArrowRight } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import { adminRequest, getAdminToken } from '../../config/adminApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  useEffect(() => { adminRequest('/dashboard').then(r=>setStats(r.data)).catch(e=>setError(e.message)) }, [])
  if (!getAdminToken()) return <Navigate to="/admin/login" replace/>
  return <section>
    <div className="admin-page-heading"><div><span className="admin-topbar-label">VUE GÉNÉRALE</span><h1>Tableau de bord</h1><p>Bienvenue dans votre espace d'administration Maeritina.</p></div><Link className="admin-primary-button link-button" to="/admin/products"><Package size={17}/> Gérer les produits</Link></div>
    {error && <div className="admin-alert error">{error}</div>}
    <div className="admin-stat-grid">
      <article className="admin-stat-card"><span className="admin-stat-icon"><Package/></span><div><small>Produits au catalogue</small><strong>{stats ? stats.totalProduits : '—'}</strong></div></article>
      <article className="admin-stat-card"><span className="admin-stat-icon orange"><Tags/></span><div><small>Catégories actives</small><strong>{stats ? stats.totalCategories : '—'}</strong></div></article>
    </div>
    <article className="admin-welcome-card"><div><h2>Gestion simple du catalogue</h2><p>Ajoutez des pièces automobiles, mettez à jour leurs informations et ajustez leurs prix depuis un seul espace.</p><Link to="/admin/products">Accéder à la gestion des produits <ArrowRight size={16}/></Link></div></article>
  </section>
}
