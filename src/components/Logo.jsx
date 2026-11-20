import { Link } from 'react-router-dom'

export default function Logo() {
  return (
    <Link className="brand" to="/" aria-label="Maeritina Quincaillerie, accueil">
      <img src="/logos/logo-maeritina.jfif" alt="Logo Maeritina Quincaillerie" />
    </Link>
  )
}
