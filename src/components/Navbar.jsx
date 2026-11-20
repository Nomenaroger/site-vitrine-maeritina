import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X, MessageCircle } from 'lucide-react'
import Logo from './Logo'
import { buildWhatsAppUrl } from '../config/urlConfig'

const navItems = [
  ['Accueil', '/'],
  ['À propos', '/a-propos'],
  ['Catalogue', '/services'],
  ['Réalisations', '/realisations'],
  // ['Actualités', '/actualites'],
  ['Contact', '/contact'],
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <span>Votre partenaire en pièces détachées automobiles</span>
          <span>Qualité <i /> Conseil <i /> Proximité</span>
        </div>
      </div>
      <div className="container nav-container">
        <div onClick={close}>
          <Logo />
        </div>
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Afficher le menu"
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={`navigation ${open ? 'navigation-open' : ''}`}>
          <div className="nav-links">
            {navItems.map(([label, path]) => (
              <NavLink key={path} to={path} end={path === '/'} onClick={close}>
                {label}
              </NavLink>
            ))}
          </div>
          <a
            className="button button-dark nav-button"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={16} /> Demander un devis
          </a>
        </nav>
      </div>
    </header>
  )
}
