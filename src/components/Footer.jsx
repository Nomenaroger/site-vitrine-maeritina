import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, ArrowUpRight } from 'lucide-react'
import Logo from './Logo'
import { buildWhatsAppUrl } from '../config/urlConfig'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand"><Logo /><p>Votre partenaire pour la recherche de pièces détachées automobiles. Contactez-nous pour vérifier une référence ou demander un devis.</p></div>
        <div><h3>Navigation</h3><Link to="/">Accueil</Link><Link to="/a-propos">À propos</Link><Link to="/services">Catalogue</Link><Link to="/contact">Contact</Link></div>
        <div><h3>Contact</h3><p><MapPin size={16} /> Adresse à confirmer</p><p><Phone size={16} /> Téléphone à confirmer</p><p><Mail size={16} /> E-mail à confirmer</p><a className="footer-link" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">Écrire sur WhatsApp <ArrowUpRight size={15}/></a></div>
      </div>
      <div className="container footer-bottom"><span>© {new Date().getFullYear()} Maeritina Quincaillerie. Tous droits réservés.</span><span>Site vitrine professionnel</span></div>
    </footer>
  )
}
