import { Link } from 'react-router-dom'
export default function NotFound(){return <section className="not-found"><span>404</span><h1>Page introuvable</h1><p>La page demandée n’existe pas ou a été déplacée.</p><Link className="button button-orange" to="/">Retour à l’accueil</Link></section>}
