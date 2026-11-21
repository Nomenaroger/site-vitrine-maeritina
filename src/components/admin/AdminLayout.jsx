import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, UserCog, LogOut, Store } from 'lucide-react'
import { clearAdminToken } from '../../config/adminApi'

export default function AdminLayout({ children }) {
  const navigate = useNavigate()

  const logout = () => {
    clearAdminToken()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <Store size={23}/>
          <span>MAERITINA<small>ADMINISTRATION</small></span>
        </div>

        <nav>
          <NavLink to="/admin" end>
            <LayoutDashboard size={18}/> Tableau de bord
          </NavLink>
          <NavLink to="/admin/products">
            <Package size={18}/> Gestion des produits
          </NavLink>
          <NavLink to="/admin/account">
            <UserCog size={18}/> Gestion du compte
          </NavLink>
        </nav>

        <button className="admin-logout" onClick={logout}>
          <LogOut size={18}/> Déconnexion
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-label">ESPACE ADMINISTRATEUR</span>
            <strong>Maeritina Quincaillerie</strong>
          </div>
          <span className="admin-user">Administrateur</span>
        </header>

        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}